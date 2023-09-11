const flow = require("./flow.json");

describe("Valida el archivo JSON del flow", () => {
  test("Debe contener al menos 2 cadenas LLM", async () => {
    expect(
      flow.nodes.reduce(
        (acc, node) => acc + (node.data.category === "Chains" ? 1 : 0),
        0
      )
    ).toBeGreaterThan(1);
  });

  test("Debe utilizar únicamente el modelo de chat gpt-3.5-turbo", () => {
    expect(
      flow.nodes
        .filter((node) => node.data.type === "ChatOpenAI")
        .every((node) => node.data.inputs.modelName === "gpt-3.5-turbo")
    ).toBe(true);
  });

  test("Debe contener al menos 1 Prompt Template", async () => {
    expect(flow.nodes.some((node) => node.data.type === "PromptTemplate")).toBe(
      true
    );
  });

  test("Debe contener al menos 1 Chat Promt Template que utilicé el input de otra cadena", async () => {
    expect(
      flow.nodes.some(
        (node) =>
          node.data.type === "ChatPromptTemplate" &&
          node.data.inputs.promptValues.match(/llmChain_\d+\.data\.instance/)
      )
    ).toBeTruthy();
  });
});
