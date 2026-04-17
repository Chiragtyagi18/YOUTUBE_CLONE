export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-secondary via-[#1f1f1f] to-secondary border-t border-gray-700 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">▶</span>
              </div>
              <span className="text-lg font-bold text-white">Stream</span>
            </div>
            <p className="text-gray-400 text-sm">The best platform to share your videos with the world.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-primary transition-colors">Home</a></li>
              <li><a href="/upload" className="text-gray-400 hover:text-primary transition-colors">Upload</a></li>
              <li><a href="/login" className="text-gray-400 hover:text-primary transition-colors">Sign In</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <a 
              href="mailto:tyagichirag009@gmail.com" 
              className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2"
            >
              <span>📧</span>
              tyagichirag009@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 Stream - All rights reserved. Built with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
