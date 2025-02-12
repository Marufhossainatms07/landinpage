
function Footer() {
  return (
    <footer className="bg-red-800 text-white py-4 text-center mt-8"> {/* Tailwind classes */}
      <p className="text-sm">&copy; 2025 Maruf Hossain. All rights reserved.</p>
      <div className="social-media-icons flex justify-center space-x-4 mt-2"> {/* Tailwind classes */}
        <a href="#" className="text-gray-300 hover:text-white"> {/* Tailwind classes */}
          <i className="fab fa-facebook fa-lg"></i> {/* Font Awesome classes */}
        </a>
        <a href="#" className="text-gray-300 hover:text-white">
          <i className="fab fa-twitter fa-lg"></i>
        </a>
        <a href="#" className="text-gray-300 hover:text-white">
          <i className="fab fa-instagram fa-lg"></i>
        </a>
        <a href="#" className="text-gray-300 hover:text-white">
          <i className="fab fa-linkedin fa-lg"></i>
        </a>
      </div>
    </footer>
  );
}

export default Footer;