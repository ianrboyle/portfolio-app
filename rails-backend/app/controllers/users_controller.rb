class UsersController < ApplicationController
  def create
    user = User.new(
      name: params[:name],
      email: params[:email],
      password: params[:password],
      password_confirmation: params[:password_confirmation]
    )
    if user.save
      render json: { message: "User created successfully" }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :bad_request
    end
  end
  def destroy
    user = User.find_by(id: params[:id])
    stocks = user.stocks
    stocks.destroy
    user.destroy

    render json: {message: "User destroyed."}
  end
end
