
import { useReports } from "@/contexts/ReportContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileJson, FileText } from "lucide-react";

const PublicData = () => {
  const { reports, exportReports } = useReports();

  const handleExport = (format: "json" | "csv") => {
    exportReports(format);
  };

  // Calcular estatísticas para a página
  const totalReports = reports.length;
  const uniqueLocations = new Set(
    reports.map(r => `${r.location.latitude},${r.location.longitude}`)
  ).size;
  const reportsWithImages = reports.filter(r => r.imageUrl).length;
  const imagePercentage = totalReports > 0 
    ? Math.round((reportsWithImages / totalReports) * 100) 
    : 0;

  return (
    <div className="container-content py-16">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dados Públicos</h1>
          <p className="text-muted-foreground mt-2">
            Acesse e baixe dados anônimos sobre criadouros do Aedes aegypti em sua região
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{totalReports}</CardTitle>
              <CardDescription>Total de Relatos</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{uniqueLocations}</CardTitle>
              <CardDescription>Locais Únicos</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{imagePercentage}%</CardTitle>
              <CardDescription>Relatos com Imagens</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Baixar Dados</CardTitle>
            <CardDescription>
              Baixe dados anonimizados sobre criadouros. Nenhuma informação pessoal está incluída.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="json" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="json">Formato JSON</TabsTrigger>
                <TabsTrigger value="csv">Formato CSV</TabsTrigger>
              </TabsList>
              
              <TabsContent value="json" className="p-4 border rounded-md mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Sobre o formato JSON</h3>
                    <p className="text-sm text-muted-foreground">
                      JSON (JavaScript Object Notation) é melhor para desenvolvedores e analistas de dados 
                      que precisam de dados estruturados para aplicações ou análises avançadas.
                    </p>
                  </div>
                  
                  <div className="bg-muted/60 p-3 rounded text-xs overflow-x-auto">
                    <pre>{`[
  {
    "id": "1",
    "title": "Recipiente de água em terreno abandonado",
    "description": "Encontrados vários recipientes acumulando água da chuva",
    "location": {
      "latitude": -23.5505,
      "longitude": -46.6333,
      "address": "Av. Paulista, 1000, São Paulo - SP"
    },
    "imageUrl": "...",
    "createdAt": "2025-04-28T15:30:45Z"
  },
  // mais relatos...
]`}</pre>
                  </div>
                  
                  <Button 
                    className="w-full gap-2"
                    onClick={() => handleExport("json")}
                  >
                    <FileJson className="h-4 w-4" />
                    Baixar JSON
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="csv" className="p-4 border rounded-md mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Sobre o formato CSV</h3>
                    <p className="text-sm text-muted-foreground">
                      CSV (Comma-Separated Values) é melhor para aplicativos de planilha como 
                      Microsoft Excel ou Google Sheets para visualização simples e análise básica.
                    </p>
                  </div>
                  
                  <div className="bg-muted/60 p-3 rounded text-xs overflow-x-auto">
                    <pre>{`id,titulo,descricao,latitude,longitude,endereco,imageUrl,criadoEm
1,"Recipiente de água em terreno abandonado","Encontrados vários recipientes acumulando água da chuva",-23.5505,-46.6333,"Av. Paulista, 1000, São Paulo - SP","...","2025-04-28T15:30:45Z"
2,"Calha entupida","Calha de chuva entupida com água parada",-23.5605,-46.6433,"Rua Augusta, 500, São Paulo - SP","","2025-04-27T10:15:30Z"
...`}</pre>
                  </div>
                  
                  <Button 
                    className="w-full gap-2"
                    onClick={() => handleExport("csv")}
                  >
                    <FileText className="h-4 w-4" />
                    Baixar CSV
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-muted-foreground max-w-md text-center">
              Estes dados são fornecidos para fins de pesquisa, educação e saúde pública.
              Nenhuma informação pessoal sobre os usuários que relataram os criadouros está incluída.
            </p>
          </CardFooter>
        </Card>

        <div className="bg-muted/30 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Diretrizes de Uso de Dados</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Estes dados estão disponíveis gratuitamente para fins não comerciais.</li>
            <li>Por favor, cite "Sistema Aedes Guardian - UNIVESP PI3 2025" ao usar estes dados em publicações ou apresentações.</li>
            <li>Os dados são fornecidos "como estão", sem garantias de completude ou precisão.</li>
            <li>Incentivamos você a usar estes dados para ajudar a combater doenças transmitidas por mosquitos em sua comunidade.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PublicData;
