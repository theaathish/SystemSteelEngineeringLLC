import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'This endpoint is not used' }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ message: 'This endpoint is not used' }, { status: 404 });
}
