-- ============================================================================
-- ESQUEMA SQL DE BASE DE DATOS: DINÁMICA QUÍMICA & BIOLÓGICA
-- Motor compatible con SQLite (sql.js WebAssembly) y MySQL / PostgreSQL
-- ============================================================================

CREATE TABLE IF NOT EXISTS jugadores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    nivel_actual INTEGER NOT NULL DEFAULT 1,
    puntos INTEGER NOT NULL DEFAULT 0,
    puntos_nivel_disp INTEGER NOT NULL DEFAULT 500,
    bonus_rapidos INTEGER NOT NULL DEFAULT 0,
    pv INTEGER NOT NULL DEFAULT 5,
    pv_max INTEGER NOT NULL DEFAULT 5,
    pociones INTEGER NOT NULL DEFAULT 1,
    aciertos INTEGER NOT NULL DEFAULT 0,
    errores INTEGER NOT NULL DEFAULT 0,
    escudo INTEGER NOT NULL DEFAULT 0,
    piedra INTEGER NOT NULL DEFAULT 0,
    alas INTEGER NOT NULL DEFAULT 0,
    llave INTEGER NOT NULL DEFAULT 0,
    estado TEXT NOT NULL DEFAULT 'En progreso',
    fecha_registro TEXT NOT NULL,
    ultima_actualizacion TEXT NOT NULL
);

-- Consulta principal en tiempo real para el Panel de Administrador (Password: holamama)
SELECT 
    id AS ID_Jugador,
    nombre AS Nombre_Heroe,
    puntos AS Puntos_Totales,
    puntos_nivel_disp AS Puntos_Disponibles_Nivel,
    bonus_rapidos AS Bonus_Rapidos_8s,
    nivel_actual AS Nivel_Actual,
    pv || '/' || pv_max AS Salud_PV,
    pociones AS Pociones,
    aciertos AS Respuestas_Correctas,
    errores AS Fallos,
    ROUND(CAST(aciertos AS FLOAT) / CASE WHEN (aciertos + errores) = 0 THEN 1 ELSE (aciertos + errores) END * 100, 1) || '%' AS Precision_Porcentaje,
    estado AS Estado_Partida,
    ultima_actualizacion AS Ultima_Actividad
FROM jugadores
ORDER BY id ASC;
