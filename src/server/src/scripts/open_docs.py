import webbrowser as wb
import time

# using 5 seconds to account for the possibility of this 
# script running on slower systems
time.sleep(5)

# opens up the docs page
wb.open('http://localhost:5555/docs')