import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { accion, pagina, detalles } = await req.json();

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_cruz_roja')?.value;
    
    let usuarioId = null;
    let rolUsuario = 'DESCONOCIDO';

    if (sessionId) {
      const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(sessionId) }
      });
      if (usuario) {
        usuarioId = usuario.id;
        rolUsuario = usuario.rol;
      }
    }

    // Insertar el log silenciosamente
    await prisma.registroLog.create({
      data: {
        accion,
        pagina,
        detalles,
        usuarioId,
        rolUsuario
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al registrar el log:", error);
    // Devuelve un 200 de todos modos para que no rompa el frontend si falla la analítica
    return NextResponse.json({ success: false, error: 'Error interno' });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_cruz_roja')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(sessionId) }
    });

    if (!usuario || usuario.rol !== 'DESARROLLADOR') {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
    }

    // Obtener los logs más recientes, límite de 200
    const logs = await prisma.registroLog.findMany({
      orderBy: { creadoEn: 'desc' },
      take: 200
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error al obtener logs:", error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
