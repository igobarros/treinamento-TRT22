package br.jus.trt22.trt22backend.config;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.Key;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

@Component
public class JWTAuthenticationFilter extends GenericFilterBean {

    //@Value("${keycloak.keystore}")
    private String keystoreFile;

    //@Value("${keystore.key.password}")
    private String keyPassword;

    //@Value("${keystore.store.password}")
    private String storePassword;

    //@Value("${keystore.alias}")
    private String storeAlias;

    @Autowired
    private ObjectMapper objectMapper;
    private Logger logger = LoggerFactory.getLogger(JWTAuthenticationFilter.class);
    private static final String HEADER_STRING = "Authorization";
    private KeyPair keyPair;
    
    /** 
    @Override
    protected void initFilterBean() throws ServletException {
        try {
            FileInputStream fis = new FileInputStream(this.keystoreFile);

            KeyStore keystore = KeyStore.getInstance(KeyStore.getDefaultType());
            keystore.load(fis, this.storePassword.toCharArray());
            Key key = keystore.getKey(this.storeAlias, this.keyPassword.toCharArray());
            Certificate cert = keystore.getCertificate(this.storeAlias);
            PublicKey publicKey = cert.getPublicKey();
            this.keyPair = new KeyPair(publicKey, (PrivateKey) key);

            logger.info("Par de chaves carregado com sucesso!");

        } catch (KeyStoreException | NoSuchAlgorithmException | CertificateException | UnrecoverableKeyException e) {
            logger.error("NÃ£o foi possÃ­vel ler o keystore", e);
        } catch (IOException e) {
            logger.error("NÃ£o foi possÃ­vel ler o keystore", e);
        }
    }
    */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {

        try {
            Authentication authentication = getAuthentication((HttpServletRequest) request);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            filterChain.doFilter(request, response);
        } catch (JWTVerificationException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            logger.error(e.getMessage(), e);
            HttpServletResponse resp = (HttpServletResponse) response;
            HttpServletRequest req = (HttpServletRequest) request;

            Map<String, ?> map = Map.of("message", e.getMessage(), "status", HttpStatus.FORBIDDEN, "path",
                    req.getRequestURI());
            resp.setStatus(HttpStatus.FORBIDDEN.value());
            resp.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(this.objectMapper.writeValueAsString(map));
        }

    }

    @SuppressWarnings("unchecked")
    private Authentication getAuthentication(HttpServletRequest request)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        String token = request.getHeader(HEADER_STRING);

        if (token != null) {
            // String pKey = "..."
            // logger.info(pKey);
            // X509EncodedKeySpec spec = new
            // X509EncodedKeySpec(Base64.getDecoder().decode(pKey));
            // KeyFactory kf = KeyFactory.getInstance("RSA");

            // RSAPublicKey publicKey = (RSAPublicKey) kf.generatePublic(spec);
            // Algorithm algorithm = Algorithm.RSA256(publicKey, null);
            // JWTVerifier verifier = JWT.require(algorithm).acceptLeeway(5000).build();
            // DecodedJWT jwt = verifier.verify(token);

            DecodedJWT jwt = null;
            if (this.keyPair != null) {
                Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) this.keyPair.getPublic(),
                        (RSAPrivateKey) this.keyPair.getPrivate());
                JWTVerifier verifier = JWT.require(algorithm).acceptLeeway(5000).build();
                jwt = verifier.verify(token);
            } else {
                jwt = JWT.decode(token);
                this.logger.warn("Token JWT foi decodificado sem validar assinatura!");
            }

            String username = jwt.getSubject();

            if (username != null) {
                Usuario usuario = new Usuario();
                usuario.setEmail(jwt.getClaim("email").asString());
                usuario.setNome(jwt.getClaim("given_name").asString());
                Map<String, Object> realmAccessMap = jwt.getClaim("realm_access").asMap();
                if (realmAccessMap != null) {
                    List<String> roles = (List<String>) realmAccessMap.getOrDefault("roles", Collections.EMPTY_LIST);
                    usuario.setPapeis(roles.stream().map(SimpleGrantedAuthority::new).collect(toList()));
                }
                return new UsernamePasswordAuthenticationToken(usuario, null, usuario.getPapeis());
            }
        }
        return null;
    }
}