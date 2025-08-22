# Christmas Cannon

This is a simple web-based project. To run it properly, you need to use a local web server due to browser security restrictions (CORS).

## Project Structure

- `index.html` — Main HTML file
- `script.js` — JavaScript logic
- `style.css` — Stylesheet

## How to Run

1. **Start a Local Web Server**

   If you have Python installed, you can use the following command in your project directory:

   ```sh
   python -m http.server 8000
   ```

   This will start a server at [http://localhost:8000](http://localhost:8000).

2. **Open in Browser**

   Go to [http://localhost:8000](http://localhost:8000) in your web browser to view and use the project.

## Why a Web Server?

Modern browsers block JavaScript files loaded directly from the file system for security reasons. Using a local server avoids these issues.

## Customization

- Edit `script.js` to change the game logic or interactivity.
- Edit `style.css` to change the appearance.

## License

This project is for educational and personal use.
