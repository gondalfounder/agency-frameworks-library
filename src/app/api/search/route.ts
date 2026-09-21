import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/frameworks";

export async function GET() {
  try {
    const data = getSearchIndex();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
