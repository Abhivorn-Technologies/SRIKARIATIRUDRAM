import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const chats = await db.collection('live_chats')
      .find({})
      .sort({ created_at: -1 })
      .limit(50)
      .toArray();

    const formattedChats = chats.reverse().map((c: any) => ({
      id: c._id?.toString() || c.id,
      user: c.user_name || 'Devotee',
      text: c.text || c.message || '',
      time: c.time || new Date(c.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    if (formattedChats.length === 0) {
      const defaultChats = [
        { user: 'Srinivas R.', text: 'ఓం నమః శివాయ! హర హర మహాదేవ!', time: '10:42 AM' },
        { user: 'Lakshmi P.', text: 'Har Har Mahadev from California 🙏', time: '10:43 AM' },
        { user: 'Ramesh Sharma', text: 'Bolo Sambho Mahadeva!', time: '10:45 AM' },
      ];
      return NextResponse.json({ success: true, data: defaultChats });
    }

    return NextResponse.json({ success: true, data: formattedChats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { db } = await connectToDatabase();
    const body = await req.json();

    if (!body.text || !body.text.trim()) {
      return NextResponse.json({ success: false, error: 'Message cannot be empty' }, { status: 400 });
    }

    const newChat = {
      user_name: body.user || body.userName || 'Devotee',
      text: body.text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      created_at: new Date()
    };

    await db.collection('live_chats').insertOne(newChat);

    return NextResponse.json({ success: true, data: newChat });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
