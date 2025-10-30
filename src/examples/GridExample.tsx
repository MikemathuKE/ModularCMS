import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/LayoutComponents";
import {
  Heading3,
  Paragraph,
  Button,
  Text,
} from "@/components/GeneralComponents";
import { ImageMedia } from "@/components/MediaComponents";

import { Modal } from "@/components/ModalComponents";

export default function ExampleGrid() {
  return (
    <Grid>
      <Modal id="exampleModal">
        <Heading3>Modal</Heading3>
        <Paragraph>
          <Text text="This is a modal that has been called by clicking Read More!"></Text>
        </Paragraph>
      </Modal>
      <Card>
        <ImageMedia
          src="/images/underwater.jpg"
          alt="Card Image 1"
          width={800}
          height={200}
        />

        <CardContent>
          <Paragraph>
            <Text
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at
            sapien eu lorem bibendum congue."
            ></Text>
          </Paragraph>
        </CardContent>

        <CardFooter>
          <Button modal="exampleModal">
            <Text text="Learn More"></Text>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <Heading3>Card Title 2</Heading3>
        </CardHeader>

        <CardContent>
          <ImageMedia
            src="/images/MyLogo.png"
            alt="Card Image 2"
            width={200}
            height={200}
          />

          <Paragraph>
            <Text
              text="Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas."
            ></Text>
          </Paragraph>
        </CardContent>

        <CardFooter>
          <Button>
            <Text text="Explore"></Text>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <Heading3>
            <Text text="Card Title 3"></Text>
          </Heading3>
        </CardHeader>

        <CardContent>
          <ImageMedia
            src="/images/MyLogo.png"
            alt="Card Image 3"
            width={200}
            height={200}
          />

          <Paragraph>
            <Text
              text="Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia curae."
            ></Text>
          </Paragraph>
        </CardContent>

        <CardFooter>
          <Button>
            <Text text="Read More"></Text>
          </Button>
        </CardFooter>
      </Card>
    </Grid>
  );
}
