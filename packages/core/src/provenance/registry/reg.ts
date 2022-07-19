import {
    ActionFunctionRegistry,
    ActionParameterMap,
    IActionRegistry,
    LabelGenerator,
    LabelGeneratorWithArgs,
    TrrackActionFunction,
} from '..';

export class ActionRegistry<
    T extends ActionParameterMap & { [key: string]: any }
> implements IActionRegistry<T>
{
    static create<T extends ActionParameterMap>(
        strictMode = true
    ): IActionRegistry<T> {
        return new ActionRegistry<T>(strictMode);
    }

    private registry: ActionFunctionRegistry<T> = {} as any;
    private labelRegistry: Record<string, LabelGeneratorWithArgs<any>> =
        {} as any;

    private constructor(private strictMode: boolean) {}

    private has(id: string) {
        if (id in this.registry) return true;

        return false;
    }

    register<
        K extends Extract<keyof T, string>,
        Action extends ActionFunctionRegistry<T>[K]
    >(
        name: K,
        labelGenerator: LabelGenerator<Parameters<Action>>,
        action: Action
    ) {
        if (this.has(name))
            throw new Error(`Action ${name} already registered.`);

        if (!(name in this.labelRegistry))
            throw new Error(`Action ${name} already registered.`);

        if (typeof labelGenerator === 'string') {
            this.labelRegistry[name] = () => labelGenerator;
        } else {
            this.labelRegistry[name] = this.labelRegistry as any;
        }

        this.registry[name] = action;
        return this;
    }

    registerUnchecked(
        name: string,
        labelGenerator: LabelGenerator<any>,
        action: TrrackActionFunction<any, any, any>
    ) {
        if (this.strictMode)
            throw new Error('Cannot register unsafe functions in strict mode.');

        return this.register(name as any, labelGenerator as any, action as any);
    }
}
