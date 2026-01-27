package com.hirespherex.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(title = "HireSphere X API", version = "v1", description = "Intelligent Recruitment Platform")
)
public class OpenApiConfig { }
