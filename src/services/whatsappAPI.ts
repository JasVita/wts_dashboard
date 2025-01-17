import axios from "axios";
import { env } from "../server/config/env";

const convertToUTCPlus8WithWeekday = (date: Date): { timestamp: string; weekday: string } => {
    const offsetTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    const timestamp = offsetTime.toISOString().split(".")[0].replace("T", " ");
    const weekday = offsetTime.toLocaleDateString("en-US", { weekday: "long" });
    return { timestamp, weekday };
  };

export const sendMessageToWhatsApp = async (
    waId: string,
    message: string
  ): Promise<void> => {
    try {
      const url = `https://graph.facebook.com/${env.whatsapp.apiVersion}/${env.whatsapp.phoneNumberId}/messages`;
  
      const response = await axios.post(
        url,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: waId,
          type: "text",
          text: {
            preview_url: true,
            body: message,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${env.whatsapp.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("[WhatsAppAPI] Message sent successfully:", response.data);
    } catch (error) {
      console.error("[WhatsAppAPI] Failed to send message:", error);
      throw error;
    }
  };

  /**
 * Save a customer service reply to the database.
 * @param waId - WhatsApp ID of the recipient.
 * @param name - Name of the chat.
 * @param message - Message content.
 * @param language - Detected language of the message.
 * @param inputTime - Timestamp of when the message was input.
 */
export const saveReplyToDB = async (
  waId: string,
  name: string,
  message: string,
  language: string
  ): Promise<void> => {
    try {
      const { timestamp: inputTime, weekday } = convertToUTCPlus8WithWeekday(new Date());
      const url = `${env.api.baseUrl}/messages/store`;
      
      await axios.post(url, {
        wa_id: waId,
        name,
        language,
        input_time: inputTime,
        weekday,
        conv_mode: `human`,
        response: message,
      });
  
      console.log("[WhatsAppAPI] Reply saved to DB successfully");
    } catch (error) {
      console.error("[WhatsAppAPI] Failed to save reply to DB:", error);
      throw error;
    }
  };
  
  
  /**
 * Fetch or initialize the Turoid chat data.
 * This can be extended to fetch the AI chat configuration from the server.
 */
export const getTuroidChat = () => {
    return {
      wa_id: "turoid",
      id: "ai-1",
      name: "Turoid",
      avatar: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=400&fit=crop",
      isAI: true,
      lastMessage: "你好！我是 Turoid，請問有什麼可以幫到你？",
      messages: [
        {
          content: "你好！我是 Turoid，請問有什麼可以幫到你？",
          isUser: false,
          timestamp: new Date(),
          input_type: "text",
        },
      ],
      labels: [],
    };
  };