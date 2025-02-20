from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
import time

# Set up the driver (e.g., Chrome)
driver = webdriver.Chrome()  # Ensure chromedriver is in your PATH

# Open your HTML file (adjust the path accordingly)
driver.get("/Users/dishantpatel/Documents/hotelSchedule/schedule.html")
time.sleep(2)  # Wait for the page to load

# Locate a card (e.g., one with text 'Ali')
card = driver.find_element(By.XPATH, "//div[text()='Ali']")

# Locate a schedule cell (for example, Monday 7am-3pm)
cell = driver.find_element(By.CSS_SELECTOR, "td[data-day='Monday'][data-shift='7am-3pm']")

# Perform drag and drop
actions = ActionChains(driver)
actions.drag_and_drop(card, cell).perform()
time.sleep(2)

# Output result to console: check card's new parent element's class
new_parent = card.find_element(By.XPATH, "./..").get_attribute("class")
print("Card's new parent class:", new_parent)

driver.quit()