module Agents
  class ManualMessageAgent < Agent
    cannot_be_scheduled!
    cannot_receive_messages!

    description <<-MD
      Manually create messages for testing or other purposes.

      Do not set options for this agent.  Instead, connect it to other agents and create messages
      using the UI provided on this agent's Summary page.
    MD

    message_description 'User determined'

    def default_options
      { 'no options' => 'are needed' }
    end

    def handle_details_post(params)
      if params['payload']
        json = interpolate_options(JSON.parse(params['payload']))
        if json['payloads'] && (json.keys - ['payloads']).length > 0
          { success: false, error: "If you provide the 'payloads' key, please do not provide any other keys at the top level." }
        else
          [json['payloads'] || json].flatten.each do |payload|
            create_message(payload: payload)
          end
          { success: true }
        end
      else
        { success: false, error: 'You must provide a JSON payload' }
      end
    end

    def validate_options
    end
  end
end
