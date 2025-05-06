import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Bug, Code, Lightbulb, Users } from "lucide-react";

const About = () => {
  return (
    <div className="container-content py-16">
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Sobre o Aedes Guardian</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Uma iniciativa comunitária para monitorar e combater o mosquito Aedes aegypti
          </p>
        </div>

        <Tabs defaultValue="project">
          <div className="flex justify-center mb-4">
            <TabsList>
              <TabsTrigger value="project">O Projeto</TabsTrigger>
              <TabsTrigger value="technical">Detalhes Técnicos</TabsTrigger>
              <TabsTrigger value="team">Nossa Equipe</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="project">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Visão Geral do Projeto
                </CardTitle>
                <CardDescription>
                  Histórico e missão do sistema Aedes Guardian
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Este projeto, intitulado Sistema Web de Monitoramento e Combate ao Aedes aegypti, foi 
                  desenvolvido como parte das atividades do Projeto Integrador III (PI3), conforme as 
                  diretrizes do Plano de Ensino da Universidade Virtual do Estado de São Paulo (Univesp).
                </p>
                <p>
                  A proposta foi construída ao longo do primeiro semestre de 2025 e reflete o 
                  compromisso acadêmico com a aplicação prática dos conhecimentos adquiridos ao longo 
                  da graduação. A equipe é composta por estudantes do Eixo de Computação, que integra 
                  os cursos de Tecnologia da Informação, Ciência de Dados e Engenharia da Computação, 
                  com representantes dos polos de Cajati, Iguape, Itariri e Santos.
                </p>
                <p>
                  Apesar da distância geográfica entre os membros, o trabalho foi realizado de forma 
                  colaborativa, utilizando ferramentas digitais para comunicação, organização e 
                  desenvolvimento. Mais do que uma entrega acadêmica, este trabalho representa o 
                  esforço conjunto de alunos engajados com a transformação social por meio da 
                  tecnologia, visando a melhoria da saúde pública em regiões vulneráveis.
                </p>
                
                <h3 className="text-xl font-bold mt-6">Nossa Missão</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Conscientização
                    </h4>
                    <p className="text-sm">
                      Aumentar a conscientização da comunidade sobre criadouros do mosquito Aedes aegypti e as doenças que ele transmite.
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Bug className="h-4 w-4 text-primary" />
                      Monitoramento
                    </h4>
                    <p className="text-sm">
                      Criar uma plataforma colaborativa para identificação e relato de possíveis criadouros.
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      Engajamento Comunitário
                    </h4>
                    <p className="text-sm">
                      Incentivar a participação cidadã através de sistemas de gamificação e reconhecimento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Informações Técnicas
                </CardTitle>
                <CardDescription>
                  Arquitetura do sistema e tecnologias utilizadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  O sistema Aedes Guardian foi desenvolvido usando tecnologias web modernas para garantir 
                  acessibilidade, responsividade e uma experiência de usuário fluida em diferentes dispositivos.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold">Tecnologias Frontend</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>React com TypeScript para segurança de tipos e melhor experiência de desenvolvimento</li>
                      <li>Tailwind CSS para design responsivo e estilização consistente</li>
                      <li>ShadCN UI para componentes acessíveis e personalizáveis</li>
                      <li>Leaflet para mapas interativos</li>
                      <li>React Router para navegação do lado do cliente</li>
                      <li>React Query para busca eficiente de dados</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">Principais Recursos</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Sistema de autenticação de usuários</li>
                      <li>Suporte à geolocalização para relato de criadouros</li>
                      <li>Visualização interativa de mapa dos locais relatados</li>
                      <li>Gamificação com pontos e títulos de conquistas</li>
                      <li>Upload de imagens para documentação visual</li>
                      <li>Exportação de dados em múltiplos formatos para pesquisa</li>
                      <li>Design responsivo para uso em dispositivos móveis e desktop</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">Acessibilidade</h3>
                    <p className="mt-1">
                      A aplicação segue as diretrizes WCAG para garantir acessibilidade para todos os usuários:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Estrutura HTML semântica</li>
                      <li>Atributos ARIA para elementos interativos</li>
                      <li>Suporte à navegação por teclado</li>
                      <li>Conformidade de contraste de cores</li>
                      <li>Conteúdo amigável para leitores de tela</li>
                      <li>Design responsivo para diferentes dispositivos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Equipe de Desenvolvimento
                </CardTitle>
                <CardDescription>
                  Conheça os estudantes por trás do projeto Aedes Guardian
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p>
                    O sistema Aedes Guardian foi desenvolvido por uma equipe de estudantes da UNIVESP da
                    área de Computação, incluindo os cursos de Tecnologia da Informação, Ciência de Dados e Engenharia da Computação,
                    como parte do Projeto Integrador III (PI3) no primeiro semestre de 2025.
                  </p>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-4">Membros da Equipe</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-bold">Aline</h4>
                        <p className="text-sm text-muted-foreground">Univesp Baixada Santista</p>
                        <p className="text-xs mt-1">Eixo Computação</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-bold">Fátima</h4>
                        <p className="text-sm text-muted-foreground">Univesp Baixada Santista</p>
                        <p className="text-xs mt-1">Eixo Computação</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-bold">Mateus</h4>
                        <p className="text-sm text-muted-foreground">Univesp Baixada Santista</p>
                        <p className="text-xs mt-1">Eixo Computação</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-bold">José</h4>
                        <p className="text-sm text-muted-foreground">Univesp Baixada Santista</p>
                        <p className="text-xs mt-1">Eixo Computação</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">Supervisão Acadêmica</h3>
                    <p className="mt-1">
                      Este projeto foi desenvolvido sob a orientação dos professores da 
                      Universidade Virtual do Estado de São Paulo (UNIVESP) como parte das 
                      exigências curriculares.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default About;
