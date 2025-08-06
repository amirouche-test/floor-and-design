import {connectDB} from '@/lib/db'
import Product from '@/models/Product'
import { NextResponse } from 'next/server'

export async function POST(req) {
  await connectDB()

  try {
    const body = await req.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 })
    }

    const existing = await Product.findOne({ name })
    return NextResponse.json({ exists: !!existing })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
