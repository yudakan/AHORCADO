import java.lang.*;

public class GenerateHtmlCanvasDivs {
    public static void main(String[] args) {
        
        final int dim = Integer.valueOf(args[0]);
        StringBuilder sb = new StringBuilder();

        for (int j=0; j < dim; j++) {
            sb.append("<div class=\"hflex\">");

            for (int i=0; i < dim; i++)
                sb.append("<div id=\"pix"+(j*dim+i)+"\" class=\"pixel\"></div>");

            sb.append("</div>");
        }

        System.out.println(sb);
    }
}