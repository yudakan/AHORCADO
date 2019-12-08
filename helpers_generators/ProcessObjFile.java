import java.lang.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Stream;

public class ProcessObjFile {
    public static void main(String[] args) {
        
        final StringBuilder sb = new StringBuilder();

        try (Stream<String> stream = Files.lines(Paths.get(args[0]))) {

			stream.forEach(e -> sb.append( "\"" + e + "\\n\"+\n" ));

		} catch (IOException e) {
			e.printStackTrace();
		} 

        System.out.println(sb);
    }
}