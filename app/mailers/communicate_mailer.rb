class CommunicateMailer < ActionMailer::Base
	default to: 'mekarosi@yahoo.com'

	def communicate_email(name, email, body)
		@name = name
        @email = email
	    @body = body

       mail(from:email, subject: 'communicate form Message')
	end

end	