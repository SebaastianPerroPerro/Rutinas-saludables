package grupo3;

import java.time.LocalDate;

public class Habito {
    private String nombre;
    private String descripcion;
    private int metaSemanal;
    private String color;
    private LocalDate ultimaFechaCompletado;

    // Constructor completo adaptado a los campos del formulario HTML
    public Habito(String nombre, String descripcion, int metaSemanal, String color) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (metaSemanal < 1 || metaSemanal > 7) {
            throw new IllegalArgumentException("La meta semanal debe estar entre 1 y 7");
        }
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.metaSemanal = metaSemanal;
        this.color = color;
        this.ultimaFechaCompletado = null;
    }

    // Constructor básico por compatibilidad si solo pasas el nombre
    public Habito(String nombre) {
        this(nombre, "", 3, "#000000");
    }

    public boolean marcarCompletadoHoy() {
        LocalDate hoy = LocalDate.now();
        if (hoy.equals(ultimaFechaCompletado)) {
            return false; // Ya fue completado hoy, no se permite dos veces
        }
        ultimaFechaCompletado = hoy;
        return true;
    }

    public boolean estaCompletadoHoy() {
        LocalDate hoy = LocalDate.now();
        return hoy.equals(ultimaFechaCompletado);
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public int getMetaSemanal() {
        return metaSemanal;
    }

    public String getColor() {
        return color;
    }
}