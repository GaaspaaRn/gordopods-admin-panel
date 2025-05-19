
import { logger } from './debug';

type FetcherOptions = {
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  timeout?: number;
  retry?: number;
  retryDelay?: number;
};

export class NetworkError extends Error {
  status: number;
  statusText: string;
  
  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
    this.statusText = statusText;
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Utilitário avançado para requisições HTTP com suporte a timeout e retry
 */
export async function fetcher<T = any>(
  url: string, 
  options: FetcherOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 30000, // 30 segundos de timeout por padrão
    retry = 1, // 1 tentativa por padrão (0 = nenhuma)
    retryDelay = 1000 // 1 segundo entre tentativas
  } = options;

  // Configuração do timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  // Função para executar a fetch com retries
  const executeFetch = async (attempt: number = 0): Promise<T> => {
    try {
      logger.info(`Executando fetch para ${url} (tentativa ${attempt + 1}/${retry + 1})`);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      // Limpar o timeout se a requisição teve sucesso
      clearTimeout(timeoutId);

      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new NetworkError(
          `Falha na requisição: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText
        );
      }

      // Processar o resultado
      if (response.headers.get('content-type')?.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text() as unknown as T;
    } catch (error: any) {
      // Se o erro foi por timeout
      if (error.name === 'AbortError') {
        throw new TimeoutError(`A requisição excedeu o timeout de ${timeout}ms`);
      }
      
      // Se ainda tem tentativas disponíveis
      if (attempt < retry) {
        logger.warn(`Tentativa ${attempt + 1} falhou. Tentando novamente em ${retryDelay}ms...`, error);
        
        // Esperar antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        // Tentar novamente
        return executeFetch(attempt + 1);
      }
      
      // Se não tem mais tentativas, propaga o erro
      logger.error(`Todas as ${retry + 1} tentativas falharam.`, error);
      throw error;
    }
  };

  return executeFetch();
}
