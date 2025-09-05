'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Phone, MapPin, Send, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/layout/footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contacto</h1>
            <p className="text-gray-600 text-lg">Estamos aqui para ajudar. Entre em contacto connosco!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">Para questões gerais:</p>
                  <a href="mailto:contacto@ligabairro.pt" className="text-blue-600 hover:text-blue-800 font-medium">
                    contacto@ligabairro.pt
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                    Suporte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">Precisa de ajuda técnica:</p>
                  <a href="mailto:suporte@ligabairro.pt" className="text-blue-600 hover:text-blue-800 font-medium">
                    suporte@ligabairro.pt
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="w-5 h-5 mr-2 text-red-600" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Fiães<br />
                    Santa Maria da Feira<br />
                    Portugal
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="w-5 h-5 mr-2 text-purple-600" />
                    Tempo de Resposta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Respondemos normalmente em 24-48 horas durante os dias úteis.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Envie-nos uma Mensagem</CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e entraremos em contacto consigo o mais rapidamente possível.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Mensagem Enviada!</h3>
                      <p className="text-gray-600 mb-4">
                        Obrigado pelo seu contacto. Responderemos em breve.
                      </p>
                      <Button 
                        onClick={() => setSubmitted(false)}
                        variant="outline"
                      >
                        Enviar Nova Mensagem
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nome *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="O seu nome"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="o.seu.email@exemplo.com"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Assunto *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                          disabled={isSubmitting}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Selecione um assunto</option>
                          <option value="suporte">Suporte Técnico</option>
                          <option value="sugestao">Sugestão de Melhoria</option>
                          <option value="problema">Reportar Problema</option>
                          <option value="parceria">Proposta de Parceria</option>
                          <option value="privacidade">Questão de Privacidade</option>
                          <option value="geral">Questão Geral</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          Mensagem *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Descreva a sua questão ou mensagem em detalhe..."
                          rows={6}
                          disabled={isSubmitting}
                          maxLength={1000}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.message.length}/1000 caracteres
                        </p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Antes de enviar:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Verifique se incluiu todos os detalhes relevantes</li>
                          <li>• Para problemas técnicos, mencione o dispositivo e navegador</li>
                          <li>• Consulte os nossos <Link href="/terms" className="text-blue-600 hover:text-blue-800">Termos de Serviço</Link> e <Link href="/privacy" className="text-blue-600 hover:text-blue-800">Política de Privacidade</Link></li>
                        </ul>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
                        className="w-full"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            A enviar...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Enviar Mensagem
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  Perguntas Frequentes
                </CardTitle>
                <CardDescription>
                  Respostas às questões mais comuns da nossa comunidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Como posso começar a usar a plataforma?</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Basta fazer login com a sua conta Google, completar o seu perfil e começar a explorar os pedidos na comunidade ou criar o seu próprio.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">A plataforma é gratuita?</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Sim, a LigaBairro é completamente gratuita para todos os utilizadores. Os pagamentos pelos serviços são acordados diretamente entre vizinhos.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Como garantir a segurança nas interações?</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Recomendamos sempre comunicar através do chat da plataforma inicialmente e confiar no sistema de avaliações para escolher com quem interagir.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Posso usar a plataforma se não viver em Fiães?</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Por agora, a plataforma está limitada aos residentes de Fiães, mas planeamos expandir para outras comunidades no futuro.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    Não encontrou a resposta que procurava? 
                    <span className="block mt-1">Use o formulário acima para nos contactar diretamente.</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}