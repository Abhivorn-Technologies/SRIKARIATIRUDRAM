import { connectToDatabase } from '@/lib/mongodb';
import { faqList } from '@/data/about';

export interface FAQItem {
  id: string;
  question: string;
  question_te?: string;
  question_hi?: string;
  answer: string;
  answer_te?: string;
  answer_hi?: string;
  category?: string;
  sort_order?: number;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const faqServerService = {
  async seedInitialFaqsIfNeeded(): Promise<void> {
    const { db } = await connectToDatabase();
    const count = await db.collection('faqs').countDocuments();

    if (count === 0 && faqList && faqList.length > 0) {
      const items = faqList.map((item, i) => ({
        id: `faq_${i + 1}`,
        question: item.q,
        question_te: item.qTe || item.q,
        question_hi: item.qHi || item.q,
        answer: item.a,
        answer_te: item.aTe || item.a,
        answer_hi: item.aHi || item.a,
        category: 'General',
        sort_order: i + 1,
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      await db.collection('faqs').insertMany(items as any);
    }
  },

  async getFaqs(onlyPublished: boolean = false): Promise<FAQItem[]> {
    await this.seedInitialFaqsIfNeeded();
    const { db } = await connectToDatabase();
    const filter: any = {};
    if (onlyPublished) filter.published = { $ne: false };

    const docs = await db.collection('faqs')
      .find(filter)
      .sort({ sort_order: 1, created_at: 1 })
      .toArray();

    return docs.map((doc: any) => ({
      ...doc,
      id: doc.id || doc._id.toString()
    }));
  },

  async createFaq(data: Partial<FAQItem>): Promise<FAQItem> {
    const { db } = await connectToDatabase();
    const faqId = 'faq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newFaq: FAQItem = {
      id: faqId,
      question: data.question || '',
      question_te: data.question_te || data.question || '',
      question_hi: data.question_hi || data.question || '',
      answer: data.answer || '',
      answer_te: data.answer_te || data.answer || '',
      answer_hi: data.answer_hi || data.answer || '',
      category: data.category || 'General',
      sort_order: data.sort_order || 0,
      published: data.published !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.collection('faqs').insertOne(newFaq as any);
    return newFaq;
  },

  async updateFaq(id: string, updates: Partial<FAQItem>): Promise<FAQItem | null> {
    const { db } = await connectToDatabase();
    const res = await db.collection('faqs').findOneAndUpdate(
      { $or: [{ id }, { _id: id as any }] },
      { $set: { ...updates, updated_at: new Date().toISOString() } },
      { returnDocument: 'after' }
    );
    const doc = (res as any)?.value || res;
    if (!doc) return null;
    return {
      ...doc,
      id: doc.id || doc._id.toString()
    } as any;
  },

  async deleteFaq(id: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    const res = await db.collection('faqs').deleteOne({
      $or: [{ id }, { _id: id as any }]
    });
    return res.deletedCount > 0;
  }
};
