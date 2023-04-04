import { Title, Flex, TextInput, Button } from "@tremor/react";
import { SearchIcon, PlusIcon } from "@heroicons/react/solid";

type PropsType = {
  value?: string;
  onChange: (value: string) => void;
  title: string;
  onAdd?: () => void;
  buttonLabel: string;
};
export default function HeaderPageContent(props: PropsType) {
  const { value, onChange, title, onAdd, buttonLabel } = props;
  return (
    <>
      <Title>{title}</Title>
      <Flex justifyContent="between" className="mt-5 gap-1">
        <div>
          <TextInput
            value={value}
            onChange={({ target }) => onChange(target.value)}
            icon={SearchIcon}
            placeholder="Search..."
          />
        </div>
        {!!onAdd && (
          <Button color="orange" onClick={onAdd} icon={PlusIcon}>
            <span className="hidden md:inline-block">{buttonLabel}</span>
          </Button>
        )}
      </Flex>
    </>
  );
}
