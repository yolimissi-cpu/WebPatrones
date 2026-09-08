async function generarPDF1a1(idSvg, nombreArchivo) {

    const svgOriginal = document.getElementById(idSvg);

    if (!svgOriginal) {
        alert("No se encuentra el patrón.");
        return;
    }

    if (!window.jspdf) {
        alert("No se ha cargado jsPDF.");
        return;
    }

    const anchoMM =
        parseFloat(svgOriginal.getAttribute("width"));

    const altoMM =
        parseFloat(svgOriginal.getAttribute("height"));

    if (!anchoMM || !altoMM) {
        alert("No se pueden obtener las medidas del patrón.");
        return;
    }


    // ==========================================
    // COPIA DEL SVG
    //
    // No modificamos el patrón que se ve
    // en pantalla.
    // ==========================================

    const svg = svgOriginal.cloneNode(true);


    // ==========================================
    // PASAR LOS ESTILOS CSS AL SVG
    //
    // svg2pdf necesita que los estilos estén
    // dentro de cada elemento.
    // ==========================================

    const originales = [
        svgOriginal,
        ...svgOriginal.querySelectorAll("*")
    ];

    const copias = [
        svg,
        ...svg.querySelectorAll("*")
    ];


    for (let i = 0; i < originales.length; i++) {

        const estilo =
            window.getComputedStyle(originales[i]);

        copias[i].style.fill =
            estilo.fill;

        copias[i].style.stroke =
            estilo.stroke;

        copias[i].style.strokeWidth =
            estilo.strokeWidth;

        copias[i].style.strokeDasharray =
            estilo.strokeDasharray;

        copias[i].style.fontSize =
            estilo.fontSize;

        copias[i].style.fontFamily =
            estilo.fontFamily;

        copias[i].style.fontWeight =
            estilo.fontWeight;
    }


    // ==========================================
    // PDF
    // ==========================================

    const { jsPDF } = window.jspdf;

    const orientacion =
        anchoMM > altoMM
            ? "landscape"
            : "portrait";


    const pdf = new jsPDF({

        orientation: orientacion,

        unit: "mm",

        format: [
            anchoMM,
            altoMM
        ],

        compress: true
    });


    if (typeof pdf.svg !== "function") {
        alert("No se ha cargado svg2pdf.");
        return;
    }


    // ==========================================
    // SVG -> PDF
    //
    // MISMO ANCHO Y ALTO EN MM
    // ==========================================

    await pdf.svg(svg, {

        x: 0,
        y: 0,

        width: anchoMM,
        height: altoMM

    });


    // ==========================================
    // GUARDAR
    // ==========================================

    pdf.save(nombreArchivo);
}