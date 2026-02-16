import { Args, Query, Resolver } from "@nestjs/graphql";
import { Demo, ExampleService } from "./example.service";

@Resolver("Demo")
export class ExampleResolver {
  constructor(private readonly exampleService: ExampleService) {}

  @Query("demos")
  async demos(): Promise<Demo[]> {
    return this.exampleService.findAll();
  }

  @Query("demo")
  async demo(@Args("id") id: string): Promise<Demo | undefined> {
    return this.exampleService.findOne(id);
  }
}
