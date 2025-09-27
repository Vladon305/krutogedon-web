// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Send, Copy, Check } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { createInvitationAsync } from "../../features/invitations/invitationsSlice";
import { RootState } from "../../store/store";
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
import styles from "./InvitationForm.module.scss";

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
    <Card className={styles.invitationForm}>
      <CardHeader className={styles.invitationForm__header}>
        <CardTitle className={styles.invitationForm__title}>
          <Send className={styles.invitationForm__titleIcon} />
          Пригласить игроков
        </CardTitle>
        <CardDescription className={styles.invitationForm__description}>
          Отправить приглашения друзьям присоединиться к игре
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.invitationForm__content}>
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

        <Separator className={styles.invitationForm__separator} />

        <div className={styles.invitationForm__linkSection}>
          <div>
            <h3 className={styles.invitationForm__linkTitle}>
              Или поделиться ссылкой напрямую
            </h3>
            <div className={styles.invitationForm__linkWrapper}>
              <div className={styles.invitationForm__linkInput}>
                {currentInviteLink ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className={styles.invitationForm__copyButton}
                    onClick={copyInviteLink}
                  >
                    {copied ? (
                      <Check className={styles.invitationForm__icon} />
                    ) : (
                      <Copy className={styles.invitationForm__icon} />
                    )}
                    <span className={styles.invitationForm__copyText}>
                      {copied ? "Скопировано" : "Копировать"}
                    </span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className={styles.invitationForm__createButton}
                    onClick={createInviteLink}
                    disabled={creatingLink}
                  >
                    {creatingLink ? "Создание..." : "Создать ссылку"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {invitations.length > 0 && (
          <div className={styles.invitationForm__invitations}>
            <h3 className={styles.invitationForm__invitationsTitle}>
              Созданные приглашения:
            </h3>
            <div className={styles.invitationForm__invitationsList}>
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className={styles.invitationForm__invitation}
                >
                  <div className={styles.invitationForm__invitationHeader}>
                    <span className={styles.invitationForm__invitationId}>
                      Приглашение #{invitation.id}
                    </span>
                    <span className={styles.invitationForm__invitationStatus}>
                      {invitation.status}
                    </span>
                  </div>
                  {invitation.lobbyLink && (
                    <div className={styles.invitationForm__invitationLink}>
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
