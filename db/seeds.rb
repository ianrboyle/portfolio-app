# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)



index = 60
while index >= 0
  number = rand(700..1200)
  other = rand(0..9)
  other = other.to_f/100
  number = number + other
  historical = Historical.create({user_id: 1, portfolio_value: number, date: (Date.today()-index)})
  index -= 1
end
