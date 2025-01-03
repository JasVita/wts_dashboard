import { Chat } from "../types";
let initialChats: Chat[] = []; // Initialize as an empty array
// let initialLabels2: Label[] = []; // Initialize as an empty array

export const fetchChats = async (): Promise<Chat[]> => {
  try {
    const response = await fetch("http://localhost:3000/api/chats/customers");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    initialChats = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return initialChats;
};

// export const fetchLabels = async (): Promise<Label[]> => {
//   try {
//     const response = await fetch("http://localhost:3000/api/labels/customers");
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     initialLabels2 = await response.json();
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
//   return initialLabels2;
// };

export const initialLabels = [
  { id: "1", name: "肉毒桿菌去皺查詢", color: "bg-red-500", count: 1 },
  { id: "2", name: "美白療程查詢", color: "bg-green-500", count: 1 },
  { id: "3", name: "豐唇療程查詢", color: "bg-blue-500", count: 1 },
  { id: "4", name: "暗瘡疤痕療程查詢", color: "bg-purple-500", count: 1 },
  { id: "5", name: "瘦面療程", color: "bg-yellow-500", count: 1 },
  { id: "6", name: "激光脫毛查詢", color: "bg-orange-500", count: 1 },
  { id: "7", name: "雙下巴去脂查詢", color: "bg-pink-500", count: 1 },
  { id: "8", name: "填充療程", color: "bg-indigo-500", count: 1 },
  { id: "9", name: "皮秒激光美白查詢", color: "bg-teal-500", count: 1 },
];

// export const initialChats = [
//   {
//     id: "1",
//     name: "Emily",
//     avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
//     isAI: false,
//     lastMessage: "你好，我想了解下額頭皺紋的肉毒桿菌療程，收費係點樣嘅？",
//     messages: [
//       { content: "你好，我想了解下額頭皺紋的肉毒桿菌療程，收費係點樣嘅？", isUser: true, timestamp: new Date() },
//       { content: "你好，Emily！我哋嘅額頭肉毒桿菌療程係按使用劑量計算，價格由 $300 起。如果想了解更準確嘅報價，我哋可以安排一個免費諮詢畀你，方便醫生評估。你有冇興趣預約？", isUser: false, timestamp: new Date() },
//       { content: "好呀，可以幫我預約。", isUser: true, timestamp: new Date() },
//       { content: "冇問題！咁你邊一日比較方便呢？", isUser: false, timestamp: new Date() },
//     ],
//     labels: [{ id: "1", name: "肉毒桿菌去皺查詢", color: "bg-red-500", count: 1 }],
//   },
//   {
//     id: "2",
//     name: "Kelvin",
//     avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
//     isAI: false,
//     lastMessage: "你哋有冇做美白療程？",
//     messages: [
//       { content: "你哋有冇做美白療程？", isUser: true, timestamp: new Date() },
//       { content: "有呀，Kelvin！我哋有提供美白針（谷胱甘肽注射）同埋專業美白療程。你想了解下過程，定直接預約諮詢呀？", isUser: false, timestamp: new Date() },
//       { content: "可唔可以先講下收費？", isUser: true, timestamp: new Date() },
//       { content: "當然可以！療程由每次 $200 起，具體費用會按皮膚狀況而定。如果有興趣，我哋可以安排免費諮詢畀你，設計最適合嘅療程。你覺得點？", isUser: false, timestamp: new Date() },
//     ],
//     labels: [{ id: "2", name: "美白療程查詢", color: "bg-green-500", count: 1 }],
//   },
//   {
//     id: "3",
//     name: "Carmen",
//     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
//     isAI: false,
//     lastMessage: "我想試下豐唇，但有啲驚，安全唔安全㗎？",
//     messages: [
//       { content: "我想試下豐唇，但有啲驚，安全唔安全㗎？", isUser: true, timestamp: new Date() },
//       { content: "你放心，Carmen！豐唇療程係經我哋專業醫生操作，選用嘅產品都係通過 FDA 認證，安全同效果都有保證。如果你仲有擔心，可以嚟做個諮詢，解答你嘅問題之餘，仲可以了解更多詳情。你有冇興趣預約？", isUser: false, timestamp: new Date() },
//       { content: "咁可以試下做個諮詢先。", isUser: true, timestamp: new Date() },
//       { content: "好嘅！我幫你睇下時間啦。", isUser: false, timestamp: new Date() },
//     ],
//     labels: [{ id: "3", name: "豐唇療程查詢", color: "bg-blue-500", count: 1 }],
//   },
//   {
//     id: "4",
//     name: "Jason",
//     avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
//     isAI: false,
//     lastMessage: "你哋有冇針對暗瘡疤痕嘅療程呀？",
//     messages: [
//       { content: "你哋有冇針對暗瘡疤痕嘅療程呀？", isUser: true, timestamp: new Date() },
//       { content: "有呀，Jason！我哋有提供激光治療、微針療程同化學換膚，針對性改善暗瘡疤痕嘅問題。如果你想知道邊種療程最啱你嘅皮膚，可以安排一次免費諮詢。你覺得點？", isUser: false, timestamp: new Date() },
//       { content: "好呀，幾時可以？", isUser: true, timestamp: new Date() },
//       { content: "我幫你睇下今星期嘅時間表先。", isUser: false, timestamp: new Date() },
//     ],
//     labels: [{ id: "4", name: "暗瘡疤痕療程查詢", color: "bg-purple-500", count: 1 }],
//   },
//   {
//     id: "5",
//     name: "Anna",
//     avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
//     isAI: false,
//     lastMessage: "想問下你哋有冇瘦面療程？",
//     messages: [
//       { content: "想問下你哋有冇瘦面療程？", isUser: true, timestamp: new Date() },
//       { content: "有呀，Anna！我哋有注射瘦面針（肉毒桿菌）同埋高能量超聲波提拉（HIFU）。收費方面，注射瘦面針由 $500 起。你有興趣了解更多，定預約面對面諮詢？", isUser: false, timestamp: new Date() },
//       { content: "我想直接預約。", isUser: true, timestamp: new Date() },
//       { content: "好嘅，咁你方便幾時過嚟？", isUser: false, timestamp: new Date() },
//     ],
//     labels: [{ id: "5", name: "瘦面療程", color: "bg-yellow-500", count: 1 }],
//   },
//   {
//     id: "6",
//     name: "Eric",
//     avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
//     isAI: false,
//     lastMessage: "請問激光脫毛係點計價嘅？",
//     messages: [
//       { content: "請問激光脫毛係點計價嘅？", isUser: true, timestamp: new Date() },
//       { content: "激光脫毛嘅收費係按部位計算，例如腋下每次 $100 起。如果你有需要，可以安排一次諮詢，設計個人化嘅療程計劃。你會唔會考慮預約？", isUser: false, timestamp: new Date() },
//       { content: "好呀。", isUser: true, timestamp: new Date() },
//       { content: "咁我幫你睇下有冇空檔時間。", isUser: false, timestamp: new Date() },
//     ],
//     labels: [{ id: "6", name: "激光脫毛查詢", color: "bg-orange-500", count: 1 }],
//   },
//   {
//     id: "7",
//     name: "Karen",
//     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
//     isAI: false,
//     lastMessage: "想問下有咩方法去雙下巴？",
//     messages: [
//       { content: "想問下有咩方法去雙下巴？", isUser: true, timestamp: new Date() },
//       { content: "你好，Karen！我哋有非手術去脂療程，例如溶脂針或者 HIFU 高能量超聲波。兩者都有即時效果，而且冇恢復期。如果你想知道邊個療程最啱你，可以考慮預約一次免費諮詢。你覺得點？", isUser: false, timestamp: new Date() },
//       { content: "聽落唔錯，可以試下預約。", isUser: true, timestamp: new Date() },
//       { content: "好嘅，我幫你安排啦！", isUser: false, timestamp: new Date() },
//     ],
//     labels: [{ id: "7", name: "雙下巴去脂查詢", color: "bg-pink-500", count: 1 }],
//   },
//   {
//     id: "8",
//     name: "Sam",
//     avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
//     isAI: false,
//     lastMessage: "請問你哋有冇做法令紋填充？",
//     messages: [
//       { content: "請問你哋有冇做法令紋填充？", isUser: true, timestamp: new Date() },
//       { content: "有呀，Sam！我哋用嘅透明質酸填充劑，效果自然、安全，仲可以改善皮膚彈性。你有興趣先了解詳細，定即刻預約試下？", isUser: false, timestamp: new Date() },
//       { content: "我想了解多啲先。", isUser: true, timestamp: new Date() },
//       { content: "冇問題！我哋可以幫你安排一次免費諮詢，醫生會解釋清楚填充效果同收費。你呢個星期幾時得閒？", isUser: false, timestamp: new Date() },
//     ],
//     labels: [{ id: "8", name: "填充療程", color: "bg-indigo-500", count: 1 }],
//   },
//   {
//     id: "9",
//     name: "Chloe",
//     avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
//     isAI: false,
//     lastMessage: "皮秒激光係唔係幫到淡斑美白？",
//     messages: [
//       { content: "皮秒激光係唔係幫到淡斑美白？", isUser: true, timestamp: new Date() },
//       { content: "係呀，Chloe！皮秒激光對淡斑同均勻膚色有非常好嘅效果，而且仲可以刺激膠原蛋白增生。如果你有興趣，可以考慮先預約一次免費諮詢，了解療程細節。你覺得點？", isUser: false, timestamp: new Date() },
//       { content: "咁我試下預約先啦。", isUser: true, timestamp: new Date() },
//       { content: "好，我即刻幫你安排。", isUser: false, timestamp: new Date() },
//     ],
//     labels: [{ id: "9", name: "皮秒激光美白查詢", color: "bg-teal-500", count: 1 }],
//   },
// ];
