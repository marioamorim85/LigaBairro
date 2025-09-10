'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
            <p className="text-gray-600 text-lg">Última atualização: 4 de setembro de 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-900">Compromisso com a Privacidade</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A PorPerto está comprometida em proteger a sua privacidade e os seus dados pessoais. Esta política explica como recolhemos, utilizamos, armazenamos e protegemos as suas informações quando utiliza a nossa plataforma.
              </p>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Database className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-900">Informações que Recolhemos</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Informações de Registo</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Nome completo</li>
                    <li>Endereço de email</li>
                    <li>Informações do perfil do Google (quando usa autenticação Google)</li>
                    <li>Fotografia de perfil (opcional)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Informações de Localização</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Localização aproximada dentro de Mozelos (para melhor correspondência de serviços)</li>
                    <li>Nunca partilhamos a sua localização exata</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Informações de Utilização</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Pedidos criados e candidaturas submetidas</li>
                    <li>Mensagens trocadas através do chat</li>
                    <li>Avaliações e comentários</li>
                    <li>Competências e serviços oferecidos</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Informações Técnicas</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Endereço IP</li>
                    <li>Tipo de dispositivo e navegador</li>
                    <li>Páginas visitadas e tempo de utilização</li>
                    <li>Cookies e tecnologias similares</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Eye className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-900">Como Utilizamos as Suas Informações</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos as suas informações para:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Fornecer e melhorar os nossos serviços</li>
                <li>Facilitar a comunicação entre vizinhos</li>
                <li>Processar pedidos e candidaturas</li>
                <li>Personalizar a sua experiência na plataforma</li>
                <li>Enviar notificações importantes sobre a sua conta</li>
                <li>Garantir a segurança da plataforma</li>
                <li>Cumprir obrigações legais</li>
                <li>Resolver disputas e prestar apoio ao cliente</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Partilha de Informações</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A PorPerto não vende os seus dados pessoais. Podemos partilhar informações limitadas nos seguintes casos:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Entre utilizadores:</strong> Informações de perfil básicas são visíveis para outros membros da comunidade</li>
                <li><strong>Prestadores de serviços:</strong> Parceiros técnicos que nos ajudam a operar a plataforma</li>
                <li><strong>Requisitos legais:</strong> Quando obrigatório por lei ou ordem judicial</li>
                <li><strong>Proteção de direitos:</strong> Para proteger os direitos, propriedade ou segurança da PorPerto e utilizadores</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Lock className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-900">Segurança dos Dados</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Implementamos medidas de segurança técnicas e organizacionais apropriadas, incluindo:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controlos de acesso rigorosos</li>
                <li>Monitorização regular de segurança</li>
                <li>Atualizações regulares de segurança</li>
                <li>Formação da equipa em melhores práticas de privacidade</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Os Seus Direitos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tem os seguintes direitos relativos aos seus dados pessoais:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Acesso</h3>
                  <p className="text-sm text-gray-700">Solicitar uma cópia dos seus dados pessoais</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Retificação</h3>
                  <p className="text-sm text-gray-700">Corrigir dados incorretos ou incompletos</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Apagamento</h3>
                  <p className="text-sm text-gray-700">Solicitar a eliminação dos seus dados</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Portabilidade</h3>
                  <p className="text-sm text-gray-700">Receber os seus dados num formato estruturado</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Oposição</h3>
                  <p className="text-sm text-gray-700">Opor-se ao processamento dos seus dados</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Limitação</h3>
                  <p className="text-sm text-gray-700">Solicitar limitação do processamento</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies e Tecnologias Similares</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos cookies para:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Manter a sua sessão ativa</li>
                <li>Lembrar as suas preferências</li>
                <li>Analisar o uso da plataforma</li>
                <li>Melhorar a funcionalidade do site</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Pode gerir as suas preferências de cookies nas configurações do navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Retenção de Dados</h2>
              <p className="text-gray-700 leading-relaxed">
                Mantemos os seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei. Quando eliminar a sua conta, removeremos os seus dados pessoais, exceto informações que devemos manter por requisitos legais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Menores de Idade</h2>
              <p className="text-gray-700 leading-relaxed">
                A nossa plataforma não se destina a menores de 16 anos. Não recolhemos intencionalmente informações pessoais de menores. Se tomar conhecimento de que recolhemos dados de um menor, contacte-nos para que possamos eliminar essas informações.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Alterações a Esta Política</h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos atualizar esta política ocasionalmente. Notificaremos sobre alterações significativas através da plataforma ou por email. A continuação do uso da plataforma após as alterações constitui aceitação da nova política.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contacto e Reclamações</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para questões sobre esta política ou para exercer os seus direitos, contacte-nos através da nossa <Link href="/contact" className="text-blue-600 hover:text-blue-800">página de contacto</Link>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Também pode apresentar uma reclamação à autoridade de proteção de dados competente se considerar que o processamento dos seus dados viola a legislação aplicável.
              </p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Base Legal para o Processamento</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Processamos os seus dados pessoais com base em:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Execução de contrato:</strong> Para fornecer os serviços solicitados</li>
                <li><strong>Interesses legítimos:</strong> Para melhorar e proteger a plataforma</li>
                <li><strong>Consentimento:</strong> Para comunicações de marketing (opcional)</li>
                <li><strong>Obrigação legal:</strong> Para cumprir requisitos legais</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}