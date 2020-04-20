module EmailConcern
  extend ActiveSupport::Concern

  MAIN_KEYS = %w[title message text main value].freeze

  included do
    validate :validate_email_options
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def validate_email_options
    errors.add(:base, 'subject and expected_receive_period_in_days are required') unless options['subject'].present? && options['expected_receive_period_in_days'].present?

    return unless options['recipients'].present?
    emails = options['recipients']
    emails = [emails] if emails.is_a?(String)
    return if emails.all? { |email| email =~ Devise.email_regexp || email =~ /\{/ }
    errors.add(:base, "'when provided, 'recipients' should be an email address or an array of email addresses")
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def recipients(payload = {})
    emails = interpolated(payload)['recipients']
    if emails.present?
      if emails.is_a?(String)
        [emails]
      else
        emails
      end
    else
      [user.email]
    end
  end

  def present(payload)
    if payload.is_a?(Hash)
      payload = ActiveSupport::HashWithIndifferentAccess.new(payload)
      MAIN_KEYS.each do |key|
        return { title: payload[key].to_s, entries: present_hash(payload, key) } if payload.key?(key)
      end

      { title: 'Message', entries: present_hash(payload) }
    else
      { title: payload.to_s, entries: [] }
    end
  end

  def present_hash(hash, skip_key = nil)
    hash.to_a.sort_by { |a| a.first.to_s }.map { |k, v| "#{k}: #{v}" unless k.to_s == skip_key.to_s }.compact
  end
end
