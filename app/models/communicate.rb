class Communicate < ApplicationRecord
	validates :name, presence: true
	validates :email, presence: true
	validates :comment, presence: true
end
