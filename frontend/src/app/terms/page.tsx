'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/layout/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Termos de Serviço</h1>
            <p className="text-gray-600 text-lg">Última atualização: 4 de setembro de 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 leading-relaxed">
                Ao aceder e utilizar a plataforma PorPerto, você concorda em cumprir e estar vinculado a estes Termos de Serviço. Se não concordar com qualquer parte destes termos, não deve utilizar os nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descrição do Serviço</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                O PorPerto é uma plataforma digital que conecta vizinhos na comunidade de Mozelos, permitindo que os utilizadores:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Criem pedidos de ajuda para diversas necessidades</li>
                <li>Ofereçam os seus serviços e competências à comunidade</li>
                <li>Comuniquem através de chat integrado</li>
                <li>Avaliem e sejam avaliados por outros membros da comunidade</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Registo e Conta de Utilizador</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para utilizar a plataforma, deve:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Manter a segurança da sua conta</li>
                <li>Ser responsável por todas as atividades na sua conta</li>
                <li>Notificar-nos imediatamente de qualquer uso não autorizado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Condutas Permitidas e Proibidas</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Condutas Permitidas:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Utilizar a plataforma de forma respeitosa e construtiva</li>
                    <li>Fornecer serviços de qualidade conforme acordado</li>
                    <li>Comunicar de forma clara e honesta</li>
                    <li>Respeitar a privacidade de outros utilizadores</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Condutas Proibidas:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Publicar conteúdo ofensivo, discriminatório ou ilegal</li>
                    <li>Assediar ou intimidar outros utilizadores</li>
                    <li>Usar a plataforma para atividades fraudulentas</li>
                    <li>Violar os direitos de propriedade intelectual</li>
                    <li>Tentar comprometer a segurança da plataforma</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Responsabilidade dos Utilizadores</h2>
              <p className="text-gray-700 leading-relaxed">
                Os utilizadores são totalmente responsáveis pelos serviços prestados e recebidos através da plataforma. O PorPerto atua apenas como facilitador da conexão entre vizinhos, não sendo responsável pela qualidade, segurança ou legalidade dos serviços prestados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Pagamentos e Transações</h2>
              <p className="text-gray-700 leading-relaxed">
                Algumas interações na plataforma podem envolver pagamentos entre utilizadores. Todas as transações financeiras são da responsabilidade das partes envolvidas. O PorPerto não processa pagamentos nem é responsável por disputas financeiras.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacidade e Proteção de Dados</h2>
              <p className="text-gray-700 leading-relaxed">
                A sua privacidade é importante para nós. Consulte a nossa <Link href="/privacy" className="text-blue-600 hover:text-blue-800">Política de Privacidade</Link> para compreender como recolhemos, utilizamos e protegemos os seus dados pessoais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Suspensão e Cancelamento</h2>
              <p className="text-gray-700 leading-relaxed">
                Reservamo-nos o direito de suspender ou cancelar contas que violem estes termos. Os utilizadores podem cancelar as suas contas a qualquer momento através das configurações de perfil ou contactando-nos diretamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitação de Responsabilidade</h2>
              <p className="text-gray-700 leading-relaxed">
                O PorPerto não será responsável por danos diretos, indiretos, acidentais ou consequenciais resultantes do uso da plataforma. A utilização do serviço é por sua conta e risco.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Alterações aos Termos</h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos atualizar estes termos ocasionalmente. As alterações serão comunicadas através da plataforma e entrarão em vigor 30 dias após a publicação. O uso continuado da plataforma após as alterações constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Lei Aplicável</h2>
              <p className="text-gray-700 leading-relaxed">
                Estes termos são regidos pelas leis de Portugal. Qualquer disputa será resolvida nos tribunais portugueses competentes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contacto</h2>
              <p className="text-gray-700 leading-relaxed">
                Para questões sobre estes termos, pode contactar-nos através da nossa <Link href="/contact" className="text-blue-600 hover:text-blue-800">página de contacto</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}