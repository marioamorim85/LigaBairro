import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 mt-16">
      <div className="container mx-auto px-4 text-center">
        <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-6 border border-gray-200">
          <img 
            src="/logo1.png" 
            alt="PorPerto Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
          Conectando a comunidade de Mozelos, uma ajuda de cada vez.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 text-sm text-gray-400 mb-6">
          <Link href="/terms" className="hover:text-white transition-colors">Termos de Serviço</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidade</Link>
          <Link href="/about" className="hover:text-white transition-colors">Sobre Nós</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contacto</Link>
        </div>
        <div className="border-t border-gray-700 pt-6">
          <p className="text-gray-500 text-sm">
            © 2025 PorPerto. Todos os direitos reservados.
            <span className="block sm:inline sm:ml-2">
              Feito com ❤️ para a comunidade de Mozelos
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}