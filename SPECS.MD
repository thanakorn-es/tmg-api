# Idea
BDD --> define what pages/things app will have so it starts with bin/www
TDD --> define what features/charterister of pages/things app will have so it starts with that particular page ex. route/blog

# Step
1. defind BDD spec (test case) ex. /tests/bdd/blog_index.js 
2. implement BDD (mostly is implementing a route) to make BDD spec passed ex. router/index.js so that we can now call /index and BDD are being able to test
3. defind TDD spec (test case) ex. /tests/tdd/blog_index.route.js
4. implement TDD 


# Script
Feature: one line description
Scenario: one line description
Given context a
and context b
When event 1
Then outcome x
and outcome y


Feature: Last Coffee with Condition 
Scenario: Buy last coffee
Given there are 1 coffees left in the machine
	and I have deposited 1$
When I press the coffee button
Then I should be served a coffee


# Use declarative steps rather than imperative
Good Example (Declarative):
Scenario: Login
Given I have logged into the system
Then I should see the ‘Welcome’ message


Bad Example (Imperative):
Scenario: Login
Given I am on the login page
When I fill “username” with “ABC”
And I fill password with “XYZ”
And I checked the “Remember Me” checkbox
And I click on the “Submit” button
Then I should log into the system
And I should see then ‘Welcome’ message


# Make Scenarios Atomic
Scenario should run independently without any dependencies on other scenarios. This will help us debug faster when something goes wrong.

# Tag your feature smartly
We should be aware of the fact that we can tag individual scenarios, so decide what value would be added by tagging an entire ‘feature’. It may be useful in some instances.
For example, you could tag a feature with the story number in a bug tracking system like JIRA.
Ex: 
@Jira-story #PROJ-33 
