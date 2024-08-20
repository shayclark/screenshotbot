# Screenshot Bot

## Overview

Screenshot Bot is a Node.js application designed to automate the process of capturing full-page screenshots of websites. It can handle multiple URLs concurrently, generating both mobile and desktop screenshots for each URL provided in a CSV file. The bot ensures efficient processing by limiting the number of concurrent page loads and provides real-time feedback on the progress via a console-based progress bar.

## Features

- **Concurrent Processing:** Handles multiple URLs simultaneously with configurable concurrency.
- **Full-Page Screenshots:** Captures the entire webpage for both mobile (500px wide) and desktop (1920px wide) views.
- **CSV Input and Output:** Ingests URLs from a CSV file and logs the result (success or error) to an output CSV.
- **Automatic Directory Creation:** Stores screenshots in a timestamped directory, ensuring organized output.
- **Progress Bar:** Displays real-time progress updates in the console, including status messages for each step.

## Requirements

- Node.js (v14 or higher)
- NPM (Node Package Manager)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/shayclark/screenshotbot.git
   cd screenshotbot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Prepare the input CSV file:**

   - Create a file named `urls.csv` in the root directory of the project.
   - The file should contain one URL per line, like so:

     ```csv
     https://example.com
     https://another-example.com
     ```

## Usage

1. **Run the bot:**

   To start the screenshot process, run the following command in your terminal:

   ```bash
   node index.js
   ```

2. **Understanding the Output:**

   - **Screenshots:**
     - Screenshots are saved in a timestamped directory under `output/`.
     - Each screenshot is saved with a filename that corresponds to the URL, followed by `-mobile` or `-desktop`, and saved as a `.png` file.
     - Example directory structure:

       ```
       screenshotbot/
       ├── output/
       │   ├── 20240820123456/  // Timestamped folder
       │   │   ├── output.csv   // Log of the run
       │   │   └── screenshots/
       │   │       ├── example_com-mobile.png
       │   │       └── example_com-desktop.png
       ├── urls.csv
       ├── package.json
       └── index.js
       ```

   - **Output CSV:**
     - The bot generates an `output.csv` file inside the timestamped folder.
     - The CSV file logs the status of each URL (e.g., `success`, `error - 404`, etc.).

3. **Customizing the Concurrency:**

   - The script processes URLs in batches to manage memory usage.
   - You can adjust the concurrency limit by modifying the `MAX_CONCURRENT_PAGES` variable in `index.js`.

## Progress Bar

During execution, the bot displays a progress bar in the console. This bar shows:

- The current progress (number of URLs processed).
- The percentage completed.
- A status message indicating the current operation (e.g., "Loading URL", "Taking screenshot", etc.).

## Error Handling

If a URL returns a status other than 200, the bot logs the error in the output CSV and skips taking screenshots for that URL. Common error codes like 301, 404, etc., are noted in the CSV file next to the URL.

## Example Use Case

Suppose you have a list of 50 URLs you want to monitor regularly. With this bot, you can automate the process of capturing screenshots for both mobile and desktop views, organize them by date, and have an error log if something goes wrong with specific URLs.

## Troubleshooting

- **Out of Memory:** If your machine runs out of memory, try reducing the `MAX_CONCURRENT_PAGES` variable.
- **No Output:** Ensure that your `urls.csv` is correctly formatted with one URL per line.


## License

This project is licensed under the GNU General Public License v3.0. You can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
