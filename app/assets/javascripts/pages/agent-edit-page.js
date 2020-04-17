(function() {
  let formatAgentForSelect = undefined;
  const Cls = (this.AgentEditPage = class AgentEditPage {
    static initClass() {

      formatAgentForSelect = function(agent) {
        const originalOption = agent.element;
        const description = agent.element[0].title;
        return `<strong>${agent.text}</strong><br/>${description}`;
      };
    }
    constructor() {
      this.invokeDryRun = this.invokeDryRun.bind(this);
      $("#agent_source_ids").on("change", this.showMessageDescriptions);
      this.showCorrectRegionsOnStartup();
      $("form.agent-form").on("submit", () => this.updateFromEditors());

      // Validate agents_options Json on form submit
      $('form.agent-form').submit(function(e) {
        if ($('textarea#agent_options').length) {
          try {
            JSON.parse($('#agent_options').val());
          } catch (err) {
            e.preventDefault();
            alert('Sorry, there appears to be an error in your JSON input. Please fix it before continuing.');
            return false;
          }
        }

        if ($(".link-region").length && ($(".link-region").data("can-receive-messages") === false)) {
          $("#agent_source_ids").val([]);
        }

        if ($(".control-link-region").length && ($(".control-link-region").data("can-control-other-agents") === false)) {
          $("#agent_control_target_ids").val([]);
        }

        if ($(".message-related-region").length && ($(".message-related-region").data("can-create-messages") === false)) {
          $("#agent_keep_messages_for").val([]);
          $("#agent_receiver_ids").val([]);
        }
      });

      $("#agent_name").each(function() {
        // Select the number suffix if this is a cloned agent.
        let matches;
        if (matches = this.value.match(/ \(\d+\)$/)) {
          this.focus();
          if (this.selectionStart != null) {
            this.selectionStart = matches.index;
            this.selectionEnd = this.value.length;
          }
        }
      });

      // The type selector is only available on the new agent form.
      if ($("#agent_type").length) {
        $("#agent_type").on("change", () => this.handleTypeChange(false));
        this.handleTypeChange(true);

        // Update the dropdown to match agent description as well as agent name
        $('select#agent_type').select2({
          width: 'resolve',
          formatResult: formatAgentForSelect,
          escapeMarkup(m) {
            return m;
          },
          matcher(term, text, opt) {
            const description = opt.attr('title');
            return (text.toUpperCase().indexOf(term.toUpperCase()) >= 0) || (description.toUpperCase().indexOf(term.toUpperCase()) >= 0);
          }
        });

      } else {
        this.enableDryRunButton();
        this.buildAce();
      }
    }

    handleTypeChange(firstTime) {
      $(".message-descriptions").html("").hide();
      const type = $('#agent_type').val();

      if (type === 'Agent') {
        $(".agent-settings").hide();
        $(".description").hide();
      } else {
        $(".agent-settings").show();
        $("#agent-spinner").fadeIn();
        if (!firstTime) { $(".model-errors").hide(); }
        $.getJSON("/agents/type_details", { type }, json => {
          if (json.can_be_scheduled) {
            if (firstTime) {
              this.showSchedule();
            } else {
              this.showSchedule(json.default_schedule);
            }
          } else {
            this.hideSchedule();
          }

          if (json.can_receive_messages) {
            this.showLinks();
          } else {
            this.hideLinks();
          }

          if (json.can_control_other_agents) {
            this.showControlLinks();
          } else {
            this.hideControlLinks();
          }

          if (json.can_create_messages) {
            this.showMessageCreation();
          } else {
            this.hideMessageCreation();
          }

          if (json.description_html) { $(".description").show().html(json.description_html); }

          if (!firstTime) {
            if (json.oauthable) { $('.oauthable-form').html(json.oauthable); }
            if (json.form_options) { $('.agent-options').html(json.form_options); }
          }

          this.enableDryRunButton();
          this.buildAce();

          window.initializeFormCompletable();
          $('[data-toggle="tooltip"]').tooltip();

          $("#agent-spinner").stop(true, true).fadeOut();
        });
      }
    }

    hideSchedule() {
      $(".schedule-region .can-be-scheduled").hide();
      $(".schedule-region .cannot-be-scheduled").show();
    }

    showSchedule(defaultSchedule = null) {
      if (defaultSchedule != null) {
        $(".schedule-region select").val(defaultSchedule).change();
      }
      $(".schedule-region .can-be-scheduled").show();
      $(".schedule-region .cannot-be-scheduled").hide();
    }

    hideLinks() {
      $(".link-region .select2-container").hide();
      $(".link-region .cannot-receive-messages").show();
      $(".link-region").data("can-receive-messages", false);
    }

    showLinks() {
      $(".link-region .select2-container").show();
      $(".link-region .cannot-receive-messages").hide();
      $(".link-region").data("can-receive-messages", true);
      this.showMessageDescriptions();
    }

    hideControlLinks() {
      $(".control-link-region").hide();
      $(".control-link-region").data("can-control-other-agents", false);
    }

    showControlLinks() {
      $(".control-link-region").show();
      $(".control-link-region").data("can-control-other-agents", true);
    }

    hideMessageCreation() {
      $(".message-related-region .select2-container").hide();
      $(".message-related-region .cannot-create-messages").show();
      $(".message-related-region").data("can-create-messages", false);
    }

    showMessageCreation() {
      $(".message-related-region .select2-container").show();
      $(".message-related-region .cannot-create-messages").hide();
      $(".message-related-region").data("can-create-messages", true);
    }

    showMessageDescriptions() {
      if ($("#agent_source_ids").val()) {
        $.getJSON("/agents/message_descriptions", { ids: $("#agent_source_ids").val().join(",") }, json => {
          if (json.description_html) {
            $(".message-descriptions").show().html(json.description_html);
          } else {
            $(".message-descriptions").hide();
          }
        });
      } else {
        $(".message-descriptions").html("").hide();
      }
    }

    showCorrectRegionsOnStartup() {
      if ($(".schedule-region")) {
        if ($(".schedule-region").data("can-be-scheduled") === true) {
          this.showSchedule();
        } else {
          this.hideSchedule();
        }
      }

      if ($(".link-region")) {
        if ($(".link-region").data("can-receive-messages") === true) {
          this.showLinks();
        } else {
          this.hideLinks();
        }
      }

      if ($(".control-link-region")) {
        if ($(".control-link-region").data("can-control-other-agents") === true) {
          this.showControlLinks();
        } else {
          this.hideControlLinks();
        }
      }

      if ($(".message-related-region")) {
        if ($(".message-related-region").data("can-create-messages") === true) {
          this.showMessageCreation();
        } else {
          this.hideMessageCreation();
        }
      }
    }

    buildAce() {
      $(".ace-editor").each(function() {
        if (!$(this).data('initialized')) {
          let mode;
          const $this = $(this);
          $this.data('initialized', true);
          const $source = $($this.data('source')).hide();
          const editor = ace.edit(this);
          editor.$blockScrolling = Infinity;
          editor.setOptions({
            minLines: 20,
            maxLines: 20
          });
          $this.data('ace-editor', editor);
          const { session } = editor;
          session.setTabSize(2);
          session.setUseSoftTabs(true);
          session.setUseWrapMode(false);

          session.setValue($source.val());

          if (mode = $this.data('mode')) {
            session.setMode(mode);
          }
        }
      });
    }

    updateFromEditors() {
      $(".ace-editor").each(function() {
        const $source = $($(this).data('source'));
        $source.val($(this).data('ace-editor').getSession().getValue());
      });
    }

    enableDryRunButton() {
      $(".agent-dry-run-button").prop('disabled', false).off().on("click", this.invokeDryRun);
    }

    disableDryRunButton() {
      $(".agent-dry-run-button").prop('disabled', true);
    }

    invokeDryRun(e) {
      e.preventDefault();
      this.updateFromEditors();
      Utils.handleDryRunButton(e.currentTarget);
    }
  });
  Cls.initClass();
  Cls;
})();

$(() => Utils.registerPage(AgentEditPage, {forPathsMatching: /^agents/}));
