import java.util.Base64;
public class TestJwt {
    public static void main(String[] args) {
        String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
        try {
            byte[] decoded = java.util.Base64.getDecoder().decode(secret);
            System.out.println("Length: " + decoded.length);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
