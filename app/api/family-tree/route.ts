import { NextRequest, NextResponse } from 'next/server';
import { 
  getFamilyTree, 
  getIndividualProfile, 
  addIndividual, 
  updateIndividual, 
  deleteIndividual,
  searchIndividuals,
  getFamilyStats,
  getAncestors,
  getDescendants
} from '../../../lib/db/operations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const generations = searchParams.get('generations');

    switch (action) {
      case 'tree':
        const tree = await getFamilyTree();
        return NextResponse.json({ success: true, data: tree });

      case 'profile':
        if (!id) {
          return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }
        const profile = await getIndividualProfile(parseInt(id));
        return NextResponse.json({ success: true, data: profile });

      case 'search':
        if (!search) {
          return NextResponse.json({ success: false, error: 'Search term is required' }, { status: 400 });
        }
        const results = await searchIndividuals(search);
        return NextResponse.json({ success: true, data: results });

      case 'stats':
        const stats = await getFamilyStats();
        return NextResponse.json({ success: true, data: stats });

      case 'ancestors':
        if (!id) {
          return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }
        const ancestors = await getAncestors(parseInt(id), parseInt(generations || '3'));
        return NextResponse.json({ success: true, data: ancestors });

      case 'descendants':
        if (!id) {
          return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }
        const descendants = await getDescendants(parseInt(id), parseInt(generations || '3'));
        return NextResponse.json({ success: true, data: descendants });

      default:
        const allIndividuals = await getFamilyTree();
        return NextResponse.json({ success: true, data: allIndividuals });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'add':
        const newIndividual = await addIndividual(data);
        return NextResponse.json({ success: true, data: newIndividual });

      case 'update':
        if (!data.id) {
          return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }
        const updatedIndividual = await updateIndividual(data.id, data);
        return NextResponse.json({ success: true, data: updatedIndividual });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const success = await deleteIndividual(parseInt(id));
    return NextResponse.json({ success });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 