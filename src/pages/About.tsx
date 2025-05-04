
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
          <h1 className="text-4xl font-bold">About Aedes Guardian</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            A community-driven initiative to monitor and combat the Aedes aegypti mosquito
          </p>
        </div>

        <Tabs defaultValue="project">
          <div className="flex justify-center mb-4">
            <TabsList>
              <TabsTrigger value="project">The Project</TabsTrigger>
              <TabsTrigger value="technical">Technical Details</TabsTrigger>
              <TabsTrigger value="team">Our Team</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="project">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Project Overview
                </CardTitle>
                <CardDescription>
                  Background and mission of the Aedes Guardian system
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
                
                <h3 className="text-xl font-bold mt-6">Our Mission</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Awareness
                    </h4>
                    <p className="text-sm">
                      Raise community awareness about Aedes aegypti mosquito breeding sites and the diseases they transmit.
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Bug className="h-4 w-4 text-primary" />
                      Monitoring
                    </h4>
                    <p className="text-sm">
                      Create a collaborative platform for identifying and reporting potential breeding sites.
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      Community Engagement
                    </h4>
                    <p className="text-sm">
                      Encourage citizen participation through gamification and recognition systems.
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
                  Technical Information
                </CardTitle>
                <CardDescription>
                  System architecture and technologies used
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The Aedes Guardian system was developed using modern web technologies to ensure 
                  accessibility, responsiveness, and a fluid user experience across different devices.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold">Frontend Technologies</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>React with TypeScript for type safety and better developer experience</li>
                      <li>Tailwind CSS for responsive design and consistent styling</li>
                      <li>ShadCN UI for accessible and customizable components</li>
                      <li>Leaflet for interactive maps</li>
                      <li>React Router for client-side navigation</li>
                      <li>React Query for efficient data fetching</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">Key Features</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>User authentication system</li>
                      <li>Geolocation support for reporting breeding sites</li>
                      <li>Interactive map visualization of reported sites</li>
                      <li>Gamification with points and achievement titles</li>
                      <li>Image upload for visual documentation</li>
                      <li>Data export in multiple formats for research purposes</li>
                      <li>Responsive design for mobile and desktop use</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">Accessibility</h3>
                    <p className="mt-1">
                      The application follows WCAG guidelines to ensure accessibility for all users:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Semantic HTML structure</li>
                      <li>ARIA attributes for interactive elements</li>
                      <li>Keyboard navigation support</li>
                      <li>Color contrast compliance</li>
                      <li>Screen reader friendly content</li>
                      <li>Responsive design for different devices</li>
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
                  Development Team
                </CardTitle>
                <CardDescription>
                  Meet the students behind the Aedes Guardian project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p>
                    The Aedes Guardian system was developed by a team of UNIVESP students from the
                    Computing area, including Information Technology, Data Science, and Computer Engineering
                    courses, as part of the Integrator Project III (PI3) in the first semester of 2025.
                  </p>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-4">Team Members</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Sample team member cards - would be replaced with actual team information */}
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-muted/30 p-4 rounded-lg">
                          <h4 className="font-bold">Student Name</h4>
                          <p className="text-sm text-muted-foreground">Polo UNIVESP</p>
                          <p className="text-xs mt-1">Curso de Tecnologia da Informação</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold">Academic Supervision</h3>
                    <p className="mt-1">
                      This project was developed under the guidance of professors from the 
                      Universidade Virtual do Estado de São Paulo (UNIVESP) as part of the 
                      curriculum requirements.
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
