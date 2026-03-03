import { Github, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-sm">
              404
            </div>
            <span className="font-semibold">404Dashboard</span>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm text-gray-400">

            <a
              href="https://github.com/Siem-Lemlem"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-purple-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            <a
              href="https://github.com/Siem-Lemlem/404dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-indigo-400 transition-colors"
            >
              <Code2 className="w-4 h-4" />
              <span>Source</span>
            </a>

            <a
              href="https://github.com/Siem-Lemlem/404dashboard/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Issues
            </a>

            <a
              href="https://github.com/Siem-Lemlem/404dashboard/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Changelog
            </a>

          </div>

          {/* Maintainer */}
          <div className="text-sm text-gray-500">
            Maintained by <span className="text-gray-300">Siem Lemlem</span>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-sm text-gray-500 space-y-1">
          <p>Open source under <a className="text-gray-300 hover:text-white" href="https://www.gnu.org/licenses/agpl-3.0.en.html" target="_blank">AGPL-3.0</a>.</p>
          <p>v0.1.0 — Active Development</p>
        </div>
      </div>
    </footer>
  );
}
