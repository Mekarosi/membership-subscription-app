require "application_system_test_case"

class CommunicatesTest < ApplicationSystemTestCase
  setup do
    @communicate = communicates(:one)
  end

  test "visiting the index" do
    visit communicates_url
    assert_selector "h1", text: "Communicates"
  end

  test "should create communicate" do
    visit communicates_url
    click_on "New communicate"

    fill_in "Comment", with: @communicate.comment
    fill_in "Email", with: @communicate.email
    fill_in "Name", with: @communicate.name
    click_on "Create Communicate"

    assert_text "Communicate was successfully created"
    click_on "Back"
  end

  test "should update Communicate" do
    visit communicate_url(@communicate)
    click_on "Edit this communicate", match: :first

    fill_in "Comment", with: @communicate.comment
    fill_in "Email", with: @communicate.email
    fill_in "Name", with: @communicate.name
    click_on "Update Communicate"

    assert_text "Communicate was successfully updated"
    click_on "Back"
  end

  test "should destroy Communicate" do
    visit communicate_url(@communicate)
    click_on "Destroy this communicate", match: :first

    assert_text "Communicate was successfully destroyed"
  end
end
