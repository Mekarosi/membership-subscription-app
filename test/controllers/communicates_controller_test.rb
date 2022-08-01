require "test_helper"

class CommunicatesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @communicate = communicates(:one)
  end

  test "should get index" do
    get communicates_url
    assert_response :success
  end

  test "should get new" do
    get new_communicate_url
    assert_response :success
  end

  test "should create communicate" do
    assert_difference("Communicate.count") do
      post communicates_url, params: { communicate: { comment: @communicate.comment, email: @communicate.email, name: @communicate.name } }
    end

    assert_redirected_to communicate_url(Communicate.last)
  end

  test "should show communicate" do
    get communicate_url(@communicate)
    assert_response :success
  end

  test "should get edit" do
    get edit_communicate_url(@communicate)
    assert_response :success
  end

  test "should update communicate" do
    patch communicate_url(@communicate), params: { communicate: { comment: @communicate.comment, email: @communicate.email, name: @communicate.name } }
    assert_redirected_to communicate_url(@communicate)
  end

  test "should destroy communicate" do
    assert_difference("Communicate.count", -1) do
      delete communicate_url(@communicate)
    end

    assert_redirected_to communicates_url
  end
end
