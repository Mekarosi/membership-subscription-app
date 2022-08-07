class PagesController < ApplicationController
	def home
		@basic_subscription = Subscription.find(1)
		@pro_subscription = Subscription.find(2)
	end

	def about
	end
end		