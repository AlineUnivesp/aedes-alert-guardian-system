
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useReports } from "@/contexts/ReportContext";
import { getCurrentPosition, getAddressFromCoordinates } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Upload, Loader2 } from "lucide-react";
import { Report } from "@/contexts/ReportContext";

interface ReportEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report;
}

const formSchema = z.object({
  title: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres.",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  imageUrl: z.string().optional(),
});

const ReportEditDialog = ({ isOpen, onClose, report }: ReportEditDialogProps) => {
  const { updateReport } = useReports();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(report.imageUrl || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: report.title,
      description: report.description,
      latitude: report.location.latitude,
      longitude: report.location.longitude,
      address: report.location.address,
      imageUrl: report.imageUrl || "",
    },
  });

  // Atualizar o formulário quando o relatório muda
  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: report.title,
        description: report.description,
        latitude: report.location.latitude,
        longitude: report.location.longitude,
        address: report.location.address,
        imageUrl: report.imageUrl || "",
      });
      setImagePreview(report.imageUrl || null);
    }
  }, [isOpen, report, form]);

  const isSubmitting = form.formState.isSubmitting;

  const handleGetLocation = async () => {
    try {
      setLoadingLocation(true);
      const position = await getCurrentPosition();
      const address = await getAddressFromCoordinates(position.latitude, position.longitude);
      
      form.setValue("latitude", position.latitude);
      form.setValue("longitude", position.longitude);
      form.setValue("address", address);
      
      toast.success("Localização atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      toast.error("Falha ao obter sua localização. Por favor, insira manualmente.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter menos de 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      form.setValue("imageUrl", result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateReport(report.id, {
        title: values.title,
        description: values.description,
        location: {
          latitude: values.latitude,
          longitude: values.longitude,
          address: values.address,
        },
        imageUrl: values.imageUrl,
      });
      onClose();
      toast.success("Denúncia atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar denúncia:", error);
      toast.error("Erro ao atualizar denúncia. Tente novamente.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Denúncia</DialogTitle>
          <DialogDescription>
            Modifique os detalhes da sua denúncia.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Água parada em terreno abandonado"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Forneça detalhes sobre o foco encontrado"
                      className="resize-none min-h-[100px]"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
              <CardContent className="pt-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium">Localização</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGetLocation}
                      disabled={loadingLocation || isSubmitting}
                    >
                      {loadingLocation ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Obtendo localização...
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          Atualizar localização
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <FormLabel>Imagem (Opcional)</FormLabel>
              <div className="flex items-center gap-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="text-sm text-gray-500">Clique para trocar imagem</p>
                    <p className="text-xs text-gray-500">PNG, JPG (máx 5MB)</p>
                  </div>
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isSubmitting}
                  />
                </label>

                {imagePreview && (
                  <div className="relative h-32 w-32">
                    <img
                      src={imagePreview}
                      alt="Prévia"
                      className="h-full w-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-6 w-6 rounded-full -translate-y-1/2 translate-x-1/2"
                      onClick={() => {
                        setImagePreview(null);
                        form.setValue("imageUrl", "");
                      }}
                      disabled={isSubmitting}
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportEditDialog;
