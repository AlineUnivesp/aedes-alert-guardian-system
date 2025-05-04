
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

  // Calculate some statistics for the page
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
          <h1 className="text-3xl font-bold">Public Data</h1>
          <p className="text-muted-foreground mt-2">
            Access and download anonymous data about Aedes breeding sites in your region
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{totalReports}</CardTitle>
              <CardDescription>Total Reports</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{uniqueLocations}</CardTitle>
              <CardDescription>Unique Locations</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{imagePercentage}%</CardTitle>
              <CardDescription>Reports with Images</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Download Data</CardTitle>
            <CardDescription>
              Download anonymized data about breeding sites. No personal information is included.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="json" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="json">JSON Format</TabsTrigger>
                <TabsTrigger value="csv">CSV Format</TabsTrigger>
              </TabsList>
              
              <TabsContent value="json" className="p-4 border rounded-md mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">About JSON Format</h3>
                    <p className="text-sm text-muted-foreground">
                      JSON (JavaScript Object Notation) is best for developers and data analysts 
                      who need structured data for applications or advanced analysis.
                    </p>
                  </div>
                  
                  <div className="bg-muted/60 p-3 rounded text-xs overflow-x-auto">
                    <pre>{`[
  {
    "id": "1",
    "title": "Water container in abandoned lot",
    "description": "Found multiple containers collecting rainwater",
    "location": {
      "latitude": -23.5505,
      "longitude": -46.6333,
      "address": "Av. Paulista, 1000, São Paulo - SP"
    },
    "imageUrl": "...",
    "createdAt": "2025-04-28T15:30:45Z"
  },
  // more reports...
]`}</pre>
                  </div>
                  
                  <Button 
                    className="w-full gap-2"
                    onClick={() => handleExport("json")}
                  >
                    <FileJson className="h-4 w-4" />
                    Download JSON
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="csv" className="p-4 border rounded-md mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">About CSV Format</h3>
                    <p className="text-sm text-muted-foreground">
                      CSV (Comma-Separated Values) is best for spreadsheet applications like 
                      Microsoft Excel or Google Sheets for simple viewing and basic analysis.
                    </p>
                  </div>
                  
                  <div className="bg-muted/60 p-3 rounded text-xs overflow-x-auto">
                    <pre>{`id,title,description,latitude,longitude,address,imageUrl,createdAt
1,"Water container in abandoned lot","Found multiple containers collecting rainwater",-23.5505,-46.6333,"Av. Paulista, 1000, São Paulo - SP","...","2025-04-28T15:30:45Z"
2,"Clogged gutter","Clogged rain gutter with standing water",-23.5605,-46.6433,"Rua Augusta, 500, São Paulo - SP","","2025-04-27T10:15:30Z"
...`}</pre>
                  </div>
                  
                  <Button 
                    className="w-full gap-2"
                    onClick={() => handleExport("csv")}
                  >
                    <FileText className="h-4 w-4" />
                    Download CSV
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-muted-foreground max-w-md text-center">
              This data is provided for research, educational, and public health purposes.
              No personal information about users who reported the breeding sites is included.
            </p>
          </CardFooter>
        </Card>

        <div className="bg-muted/30 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Data Usage Guidelines</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>This data is freely available for non-commercial purposes.</li>
            <li>Please cite "Aedes Guardian System - UNIVESP PI3 2025" when using this data in publications or presentations.</li>
            <li>The data is provided "as is" with no guarantees of completeness or accuracy.</li>
            <li>We encourage you to use this data to help combat mosquito-borne diseases in your community.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PublicData;
