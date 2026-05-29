import re
from pathlib import Path

root = Path('src/main/java/com/ternurines')

class_descriptions = {
    'TernurinesApplication': 'Punto de entrada de la aplicación Spring Boot que inicia el servicio backend de Ternurines.',
    'AuthController': 'Controlador REST que expone endpoints de autenticación y login.',
    'AuthService': 'Servicio de lógica de negocio para autenticación de usuarios.',
    'LoginRequest': 'DTO que representa la solicitud de login del usuario.',
    'LoginResponse': 'DTO que representa la respuesta de login con datos del usuario autenticado.',
    'Cita': 'Modelo de dominio que representa una cita veterinaria.',
    'CitaController': 'Controlador REST que expone endpoints para gestionar citas.',
    'CitaRepository': 'Repositorio de datos para acceso SQL a citas.',
    'CitaService': 'Servicio de lógica de negocio para gestión de citas.',
    'Cliente': 'Modelo de dominio que representa un cliente del sistema.',
    'ClienteController': 'Controlador REST que expone endpoints para gestionar clientes.',
    'ClienteRepository': 'Repositorio de datos para acceso SQL a clientes.',
    'ClienteService': 'Servicio de lógica de negocio para gestión de clientes.',
    'DashboardSummary': 'DTO que contiene métricas y resumen del dashboard administrativo.',
    'DashboardCita': 'DTO que representa una cita próxima para mostrar en el dashboard.',
    'DashboardController': 'Controlador REST que proporciona datos del dashboard.',
    'HistorialController': 'Controlador REST para gestionar el historial médico de mascotas.',
    'HistorialMascota': 'Modelo que representa el historial médico de una mascota.',
    'HistorialRequest': 'DTO para solicitar creación o actualización de historial.',
    'HistorialResponse': 'DTO que representa la respuesta del historial médico.',
    'HistorialService': 'Servicio de lógica de negocio para gestión de historiales médicos.',
    'MedicamentoRef': 'DTO que referencia un medicamento en un tratamiento.',
    'Tratamiento': 'Modelo de dominio que representa un tratamiento médico aplicado a una mascota.',
    'TratamientoRequest': 'DTO para solicitar creación o actualización de tratamiento.',
    'Veterinario': 'Modelo que representa un veterinario del sistema.',
    'InventarioController': 'Controlador REST para gestionar inventario de medicamentos y productos.',
    'Medicamento': 'Modelo de dominio que representa un medicamento en inventario.',
    'MedicamentoRepository': 'Repositorio de datos para acceso SQL a medicamentos.',
    'Producto': 'Modelo de dominio que representa un producto en inventario.',
    'ProductoRepository': 'Repositorio de datos para acceso SQL a productos.',
    'Mascota': 'Modelo de dominio que representa una mascota registrada.',
    'MascotaController': 'Controlador REST que expone endpoints para gestionar mascotas.',
    'MascotaRepository': 'Repositorio de datos para acceso SQL a mascotas.',
    'MascotaService': 'Servicio de lógica de negocio para gestión de mascotas.',
    'OperationsController': 'Controlador REST que expone operaciones diversas del sistema.',
    'Servicio': 'Modelo de dominio que representa un servicio veterinario ofrecido.',
    'ServicioController': 'Controlador REST que expone endpoints para gestionar servicios.',
    'ServicioRepository': 'Repositorio de datos para acceso SQL a servicios.',
}

method_descriptions = {
    'getId': 'Obtiene el identificador único del objeto.',
    'setId': 'Establece el identificador único del objeto.',
    'getNombre': 'Obtiene el nombre del objeto.',
    'setNombre': 'Establece el nombre del objeto.',
    'getCorreo': 'Obtiene el correo electrónico.',
    'setCorreo': 'Establece el correo electrónico.',
    'getContrasena': 'Obtiene la contraseña.',
    'setContrasena': 'Establece la contraseña.',
    'getTelefono': 'Obtiene el número de teléfono.',
    'setTelefono': 'Establece el número de teléfono.',
    'getDireccion': 'Obtiene la dirección.',
    'setDireccion': 'Establece la dirección.',
    'getDocumento': 'Obtiene el número de documento de identidad.',
    'setDocumento': 'Establece el número de documento de identidad.',
    'getEspecialidad': 'Obtiene la especialidad del veterinario.',
    'setEspecialidad': 'Establece la especialidad del veterinario.',
    'getNumLicencia': 'Obtiene el número de licencia profesional.',
    'setNumLicencia': 'Establece el número de licencia profesional.',
    'getIdMascota': 'Obtiene el identificador de la mascota.',
    'setIdMascota': 'Establece el identificador de la mascota.',
    'getIdCliente': 'Obtiene el identificador del cliente.',
    'setIdCliente': 'Establece el identificador del cliente.',
    'getIdVeterinario': 'Obtiene el identificador del veterinario.',
    'setIdVeterinario': 'Establece el identificador del veterinario.',
    'getEspecie': 'Obtiene la especie de la mascota.',
    'setEspecie': 'Establece la especie de la mascota.',
    'getRaza': 'Obtiene la raza de la mascota.',
    'setRaza': 'Establece la raza de la mascota.',
    'getEdad': 'Obtiene la edad.',
    'setEdad': 'Establece la edad.',
    'getPeso': 'Obtiene el peso.',
    'setPeso': 'Establece el peso.',
    'getSexo': 'Obtiene el sexo.',
    'setSexo': 'Establece el sexo.',
    'getFecha': 'Obtiene la fecha.',
    'setFecha': 'Establece la fecha.',
    'getHora': 'Obtiene la hora.',
    'setHora': 'Establece la hora.',
    'getMotivo': 'Obtiene el motivo de la consulta o cita.',
    'setMotivo': 'Establece el motivo de la consulta o cita.',
    'getEstado': 'Obtiene el estado actual del objeto.',
    'setEstado': 'Establece el estado actual del objeto.',
    'getPrecio': 'Obtiene el precio.',
    'setPrecio': 'Establece el precio.',
    'getStock': 'Obtiene la cantidad en stock.',
    'setStock': 'Establece la cantidad en stock.',
    'getDescripcion': 'Obtiene la descripción.',
    'setDescripcion': 'Establece la descripción.',
    'getDiagnostico': 'Obtiene el diagnóstico médico.',
    'setDiagnostico': 'Establece el diagnóstico médico.',
    'getDosis': 'Obtiene la dosis de medicamento.',
    'setDosis': 'Establece la dosis de medicamento.',
    'getObservaciones': 'Obtiene observaciones adicionales.',
    'setObservaciones': 'Establece observaciones adicionales.',
    'getFechaVencimiento': 'Obtiene la fecha de vencimiento.',
    'setFechaVencimiento': 'Establece la fecha de vencimiento.',
    'getFechaInicio': 'Obtiene la fecha de inicio.',
    'setFechaInicio': 'Establece la fecha de inicio.',
    'getFechaFin': 'Obtiene la fecha de finalización.',
    'setFechaFin': 'Establece la fecha de finalización.',
    'listAll': 'Obtiene la lista completa de elementos.',
    'findAll': 'Consulta todos los elementos de la base de datos.',
    'create': 'Crea un nuevo elemento en el sistema.',
    'update': 'Actualiza un elemento existente.',
    'delete': 'Elimina un elemento del sistema.',
    'save': 'Persiste un elemento en la base de datos.',
    'findById': 'Busca un elemento por su identificador.',
    'authenticate': 'Autentica un usuario contra la base de datos.',
    'getSummary': 'Obtiene el resumen de métricas del dashboard.',
    'login': 'Procesa el login de un usuario.',
    'cancel': 'Cancela una cita.',
    'complete': 'Marca una cita como completada.',
    'isVeterinarioDisponible': 'Verifica la disponibilidad del veterinario en un horario.',
    'getTotalUsuarios': 'Obtiene el total de usuarios registrados.',
    'setTotalUsuarios': 'Establece el total de usuarios registrados.',
    'getMascotasRegistradas': 'Obtiene el total de mascotas registradas.',
    'setMascotasRegistradas': 'Establece el total de mascotas registradas.',
    'getCitasProgramadas': 'Obtiene el total de citas programadas.',
    'setCitasProgramadas': 'Establece el total de citas programadas.',
    'getMedicamentosEnStock': 'Obtiene el total de medicamentos en stock.',
    'setMedicamentosEnStock': 'Establece el total de medicamentos en stock.',
    'getStockBajo': 'Obtiene el total de medicamentos con bajo stock.',
    'setStockBajo': 'Establece el total de medicamentos con bajo stock.',
    'getProximasCitas': 'Obtiene la lista de próximas citas.',
    'setProximasCitas': 'Establece la lista de próximas citas.',
    'getMascota': 'Obtiene el nombre de la mascota.',
    'setMascota': 'Establece el nombre de la mascota.',
    'getVeterinario': 'Obtiene el nombre del veterinario.',
    'setVeterinario': 'Establece el nombre del veterinario.',
    'getCliente': 'Obtiene el nombre del cliente.',
    'setCliente': 'Establece el nombre del cliente.',
    'getIdCita': 'Obtiene el identificador de la cita.',
    'setIdCita': 'Establece el identificador de la cita.',
    'getIdRecepcionista': 'Obtiene el identificador de la recepcionista.',
    'setIdRecepcionista': 'Establece el identificador de la recepcionista.',
    'getIdHistorial': 'Obtiene el identificador del historial.',
    'setIdHistorial': 'Establece el identificador del historial.',
    'getIdMedicamento': 'Obtiene el identificador del medicamento.',
    'setIdMedicamento': 'Establece el identificador del medicamento.',
    'getIdAdministrador': 'Obtiene el identificador del administrador.',
    'setIdAdministrador': 'Establece el identificador del administrador.',
    'getIdProducto': 'Obtiene el identificador del producto.',
    'setIdProducto': 'Establece el identificador del producto.',
    'getIdServicio': 'Obtiene el identificador del servicio.',
    'setIdServicio': 'Establece el identificador del servicio.',
    'correo': 'Obtiene el correo del usuario.',
    'contrasena': 'Obtiene la contraseña del usuario.',
    'usuario': 'Obtiene el nombre de usuario.',
    'rol': 'Obtiene el rol del usuario.',
    'id': 'Obtiene el identificador.',
}

def get_class_doc(class_name):
    """Obtiene la descripción de la clase."""
    return class_descriptions.get(class_name, f'Clase {class_name} del sistema.')

def get_method_doc(method_name):
    """Obtiene la descripción del método."""
    return method_descriptions.get(method_name, f'Método {method_name}.')

def add_javadoc_to_file(file_path):
    """Agrega JavaDoc a un archivo Java."""
    text = file_path.read_text(encoding='utf-8')
    lines = text.splitlines(keepends=False)
    new_lines = []
    i = 0
    
    # Regex para detectar clases, métodos e interfaces
    class_regex = re.compile(r'^(public|private|protected)?\s+(final\s+)?(class|record|interface)\s+(\w+)')
    method_regex = re.compile(r'^(public|private|protected)?\s+(static\s+)?(synchronized\s+)?(\w+[\w<>\[\],\s]*)\s+(\w+)\s*\([^)]*\)\s*(\{|throws|;)')
    
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Check for class/record/interface definition
        class_match = class_regex.match(stripped)
        if class_match:
            # Check if there's already a JavaDoc comment
            j = i - 1
            has_javadoc = False
            while j >= 0 and lines[j].strip() == '':
                j -= 1
            if j >= 0 and lines[j].strip().endswith('*/'):
                has_javadoc = True
            
            if not has_javadoc:
                class_name = class_match.group(4)
                doc_text = get_class_doc(class_name)
                javadoc_lines = [
                    '/**',
                    f' * {doc_text}',
                    ' */'
                ]
                for jdoc_line in javadoc_lines:
                    new_lines.append(jdoc_line)
            
            new_lines.append(line)
            i += 1
        
        # Check for method definition
        elif method_regex.match(stripped) and '(' in line:
            # Exclude constructors and annotations
            is_constructor = class_name in stripped if 'class_name' in locals() else False
            is_annotation = '@' in line
            if not is_constructor and not is_annotation and not stripped.startswith('return') and not stripped.startswith('throw'):
                # Check if there's already a JavaDoc comment
                j = i - 1
                has_javadoc = False
                while j >= 0 and lines[j].strip() == '':
                    j -= 1
                if j >= 0 and (lines[j].strip().endswith('*/') or lines[j].strip().startswith('@')):
                    # Skip if there's already JavaDoc or annotation
                    has_javadoc = True
                
                if not has_javadoc:
                    method_match = method_regex.match(stripped)
                    if method_match:
                        method_name = method_match.group(5)
                        doc_text = get_method_doc(method_name)
                        javadoc_lines = [
                            '    /**',
                            f'     * {doc_text}',
                            '     */'
                        ]
                        for jdoc_line in javadoc_lines:
                            new_lines.append(jdoc_line)
            
            new_lines.append(line)
            i += 1
        else:
            new_lines.append(line)
            i += 1
    
    updated_text = '\n'.join(new_lines)
    if updated_text != text:
        file_path.write_text(updated_text + '\n', encoding='utf-8')
        return True
    return False

# Process all Java files
count = 0
for java_file in root.rglob('*.java'):
    if add_javadoc_to_file(java_file):
        count += 1
        print(f'✓ {java_file.relative_to(root)}')

print(f'\nTotal archivos actualizados: {count}')
