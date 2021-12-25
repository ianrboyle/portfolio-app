class User < ApplicationRecord
  has_secure_password
  validates :email, presence: true, uniqueness: true
  has_many :stocks
  has_many :historicals
  has_many :sectors, through: :stocks


end
