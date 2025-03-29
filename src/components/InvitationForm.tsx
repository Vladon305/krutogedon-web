// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Send, Copy, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { createInvitationAsync } from "../features/invitations/invitationsSlice";
import { RootState } from "../store/store";
import { useState } from "react";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   FormDescription,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

// Invitation form schema
// const inviteSchema = z.object({
//   emails: z.string().optional(),
//   message: z.string().optional(),
//   sendCopy: z.boolean().default(false),
// });

const InvitationForm = () => {
  const dispatch = useDispatch();
  const { accessToken } = useAuth();
  const invitations = useSelector(
    (state: RootState) => state.invitations.invitations
  );
  const [copied, setCopied] = useState(false);
  // const [sending, setSending] = useState(false);
  const [creatingLink, setCreatingLink] = useState(false);
  const [currentInviteLink, setCurrentInviteLink] = useState<string>("");

  // const form = useForm<z.infer<typeof inviteSchema>>({
  //   resolver: zodResolver(inviteSchema),
  //   defaultValues: {
  //     emails: "",
  //     message: "Join me in Krutagidon for some extremely spicy card battles!",
  //     sendCopy: false,
  //   },
  // });

  // const onSubmit = async (values: z.infer<typeof inviteSchema>) => {
  //   if (!accessToken) {
  //     toast.error("Please log in to send invitations");
  //     return;
  //   }

  //   setSending(true);
  //   const emails = values.emails
  //     ? values.emails.split(",").map((email) => email.trim())
  //     : [];

  //   try {
  //     const newInvitation = await dispatch(
  //       createInvitationAsync({
  //         token: accessToken,
  //         // invitedEmails: emails,
  //       }) as any
  //     ).unwrap();
  //     toast.success(`Invitations sent to ${emails.length} recipients`);

  //     setCurrentInviteLink(newInvitation.lobbyLink || "");

  //     form.reset({
  //       emails: "",
  //       message: "Join me in Krutagidon for some extremely spicy card battles!",
  //       sendCopy: false,
  //     });
  //   } catch (error) {
  //     toast.error("Failed to send invitations");
  //   } finally {
  //     setSending(false);
  //   }
  // };

  const createInviteLink = async () => {
    if (!accessToken) {
      toast.error("Please log in to create an invite link");
      return;
    }

    setCreatingLink(true);
    try {
      const newInvitation = await dispatch(
        createInvitationAsync({
          token: accessToken,
          // invitedEmails: []
        }) as any
      ).unwrap();
      setCurrentInviteLink(newInvitation.lobbyLink || "");
      await copyInviteLink();
      toast.success("Invite link created!");
    } catch (error) {
      toast.error("Failed to create invite link");
    } finally {
      setCreatingLink(false);
    }
  };

  const copyInviteLink = async () => {
    if (!currentInviteLink) {
      toast.error("No invite link available. Create one first.");
      return;
    }

    await navigator.clipboard.writeText(currentInviteLink);
    setCopied(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 glass-panel overflow-hidden">
      <CardHeader className="space-y-1 text-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
        <CardTitle className="text-2xl font-bold">
          <Send className="w-6 h-6 inline mr-2" />
          Пригласить игроков
        </CardTitle>
        <CardDescription className="text-white/80">
          Отправить приглашения друзьям присоединиться к игре
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {/* <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email-адреса (опционально)</FormLabel>
                  <FormDescription>
                    Введите адреса через запятую
                  </FormDescription>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="user1@example.com, user2@example.com"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сообщение</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Введите персональное сообщение"
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sendCopy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Отправить копию мне</FormLabel>
                    <FormDescription>
                      Вы получите копию приглашения на вашу почту
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? (
                <>Отправка...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Отправить приглашения
                </>
              )}
            </Button>
          </form>
        </Form> */}

        <Separator className="my-4" />

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">
              Или поделиться ссылкой напрямую
            </h3>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                {/* <Link className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /> */}
                {/* <Input
                  value={
                    currentInviteLink ||
                    'Нажмите "Создать ссылку", чтобы получить ссылку'
                  }
                  readOnly
                  className="pl-10 pr-24 text-sm"
                /> */}
                {/* <div className="absolute right-1 top-1 flex space-x-1"> */}
                {currentInviteLink ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8"
                    onClick={copyInviteLink}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="ml-1">
                      {copied ? "Скопировано" : "Копировать"}
                    </span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8"
                    onClick={createInviteLink}
                    disabled={creatingLink}
                  >
                    {creatingLink ? "Создание..." : "Создать ссылку"}
                  </Button>
                )}
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>

        {invitations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Созданные приглашения:</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="p-3 bg-secondary/30 rounded-md text-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">
                      Приглашение #{invitation.id}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                      {invitation.status}
                    </span>
                  </div>
                  {invitation.lobbyLink && (
                    <div className="text-xs text-blue-600 hover:underline overflow-hidden text-ellipsis">
                      <Link
                        to={invitation.lobbyLink}
                        // target="_blank"
                        // rel="noreferrer"
                      >
                        {invitation.lobbyLink}
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitationForm;
