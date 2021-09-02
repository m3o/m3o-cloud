import { SchemaObject } from 'openapi3-ts';

export interface ExampleArguments {
  path: string;
  request: SchemaObject;
  serviceName: string;
}

export interface GetPriceArguments {
  pricing?: Record<string, string>;
  key: string;
}

export function requestToCurl({
  request,
  path,
  serviceName,
}: ExampleArguments): string {
  // if (stream != true) {
  return `curl "https://api.m3o.com/v1/${serviceName}/${lastPart(path)}" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer INSERT_YOUR_TOKEN_HERE" \\
-d '${schemaToJSON(request)}'`;
  // }

  //   return (
  //     `curl "https://api.m3o.com/v1/` +
  //     this.serviceName +
  //     `/` +
  //     this.lastPart(path) +
  //     `" \\
  // --include \\
  // --no-buffer \\
  // --header "Connection: Upgrade" \\
  // --header "Upgrade: websocket" \\
  // --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \\
  // --header "Sec-WebSocket-Version: 13" \\
  // -H "Authorization: Bearer INSERT_YOUR_TOKEN_HERE" \\
  // -H 'Content-Type: application/json' \\
  // -d '` +
  //     this.schemaToJSON(request) +
  //     `'`
  //   );
}

export function requestToGo({
  request,
  path,
  serviceName,
}: ExampleArguments): string {
  // if (stream != true) {
  return (
    `package main

import (
    "fmt"

    "github.com/m3o/m3o-go/client"
)
  
func main() {
    c := client.NewClient(&client.Options{
      Token: "INSERT_YOUR_TOKEN_HERE",
    })

req := ` +
    schemaToGoMap(request) +
    `
var rsp map[string]interface{}

if err := c.Call("` +
    serviceName +
    `", "` +
    lastPart(path) +
    `", req, &rsp); err != nil {
  fmt.Println(err)
  return
}
}`
  );
  // }

  //   return (
  //     `package main

  // import (
  // "fmt"

  // "github.com/m3o/m3o-go/client"
  // )

  // func main() {
  // c := client.NewClient(&client.Options{
  //   Token: "INSERT_YOUR_TOKEN_HERE",
  // })

  // req := ` +
  //     this.schemaToGoMap(request) +
  //     `
  // stream, err := c.Stream("` +
  //     this.serviceName +
  //     `", "` +
  //     this.lastPart(path) +
  //     `", req)
  // if err != nil {
  //   fmt.Println(err)
  //   return
  // }

  // for {
  //   var rsp map[string]interface{}
  //   if err := stream.Recv(&rsp); err != nil {
  //     return
  //   }
  //   fmt.Println(rsp)
  // }
  // }`
  //   );
}

export function requestToNode({
  serviceName,
  path,
  request,
}: ExampleArguments): string {
  return `import m3o from '@m3o/m3o-node';

const client = new m3o.Client({ token: 'YOUR_M3O_API_KEY' });

client.call('${serviceName}', '${path}', ${schemaToJSON(request)})
  .then(response => {
    console.log(response);          
  });`;
}

export function schemaToJSON(schema: SchemaObject): string {
  let recur = (schema: SchemaObject): Object => {
    switch (schema.type as string) {
      case 'object':
        let ret = {};
        for (let key in schema.properties) {
          ret[key] = recur(schema.properties[key]);
        }
        return ret;
      case 'array':
        switch ((schema.items as any).type) {
          case 'object':
            return [recur(schema.items)];
          case 'string':
            return [''];
          case 'int':
          case 'int32':
          case 'int64':
            return [0];
          case 'bool':
            return [false];
        }
      case 'string':
        return '';
      case 'int':
      case 'int32':
      case 'int64':
        return 0;
      case 'bool':
        return false;
      // typescript types below
      case 'number':
        return 0;
      case 'boolean':
        return false;
      default:
        return schema.type;
    }
  };

  return JSON.stringify(recur(schema), null, 2);
}

// this is an unfinished method to convert
// openapi schemas to go struct type definitions
export function schemaToGoMap(schema: SchemaObject): string {
  const prefix = '  ';
  let recur = function (schema: SchemaObject, level: number): string {
    switch (schema.type as string) {
      case 'object':
        let ret = prefix.repeat(level) + 'map[string]interface{}{\n';

        for (let key in schema.properties) {
          ret +=
            prefix.repeat(level + 8) +
            '"' +
            key +
            '"' +
            ' : ' +
            recur(schema.properties[key], level + 1) +
            ',\n';
        }
        ret += prefix.repeat(level + 4) + '}';
        if (level > 1) {
          ret += ',\n';
        } else {
          ret += '\n';
        }
        return ret;
      case 'array':
        switch ((schema.items as any).type) {
          case 'object':
            return (
              '[]interface{}{\n' +
              recur(schema.items, level + 1) +
              prefix.repeat(level) +
              '}'
            );
          case 'string':
            return '[]interface{}{""}';
          case 'int':
          case 'int32':
          case 'number':
          case 'int64':
            return '[]interface{}{0}';
          case 'boolean':
          case 'bool':
            return '[]interface{}{false}';
        }
      case 'string':
        return '""';
      case 'int':
      case 'int32':
      case 'number':
      case 'int64':
        return '0';
      case 'boolean':
      case 'bool':
        return 'false';
      default:
        return schema.type;
    }
  };

  return recur(schema, 0);
}

export function lastPart(s: string): string {
  const splitString = s.split('/');
  return splitString[splitString.length - 1];
}

export function getPrice({ pricing = {}, key }: GetPriceArguments): string {
  return pricing[key]
    ? `$${parseInt(pricing[key]) / 1000000} per request`
    : 'Free';
}

export function getEndpointNameFromApiEndpoint(str: string): string {
  return str.substring(str.indexOf('.') + 1);
}
