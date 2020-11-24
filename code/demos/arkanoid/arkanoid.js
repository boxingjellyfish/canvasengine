class ArkanoidScene extends Scene {
    constructor() {
        super();
    }

    keyPressed(key) {
        super.keyPressed(key);
    }

    init() {
        this.worldSize = new Vector(5000, 2400);
        this.entityManager.clear();
        this.camera.targetPosition = Vector.Zero;
        this.camera.targetZoom = 1;

        // Random entities
        for (var i = 0; i < 200; i++) {
            var entity = new Entity();
            var scale = new Vector(Random.Int(5, 50), Random.Int(5, 50));
            var position = new Vector(Random.Float(-100, 100), Random.Float(-100, 100));
            Entity.AddComponent(entity, new TransformComponent(position, scale));
            var velocity = new Vector(Random.Float(-0.1, 0.1), Random.Float(-0.1, 0.1));
            var maxVelocity = Random.Float(0.05, 1.5);
            var acceleration = new Vector(Random.Float(-0.0001, 0.0001), Random.Float(-0.0001, 0.0001));
            Entity.AddComponent(entity, new MotionComponent(velocity, maxVelocity, acceleration));
            var color = new Color(Random.Int(0, 360), 75, 60, 1);
            Entity.AddComponent(entity, new ShapeComponent(color, Random.Value([ShapeTypes.RECTANGLE, ShapeTypes.ELLIPSE, ShapeTypes.TRIANGLE])));
            Entity.AddComponent(entity, new TraceComponent(2, color));
            Entity.AddComponent(entity, new SelectableComponent());

            var animation = new AnimationComponent();
            var colorAnimation = new AnimationSequence();
            colorAnimation.keyframes = [0, Random.Int(1000, 2000), Random.Int(3000, 4000)];
            colorAnimation.values = [Color.Copy(color), new Color(Random.Int(0, 360), 75, 60, 1), Color.Copy(color)];
            colorAnimation.component = Components.SHAPE;
            colorAnimation.property = "color";
            colorAnimation.type = AnimationSequenceTypes.COLOR;
            colorAnimation.easing = "Linear";
            animation.sequences.push(colorAnimation);
            var scaleAnimation = new AnimationSequence();
            scaleAnimation.keyframes = [0, Random.Int(200, 500), Random.Int(800, 1000), Random.Int(1200, 1500)];
            scaleAnimation.values = [Vector.Copy(scale), Vector.Multiply(Vector.Copy(scale), new Vector(2, 2)), Vector.Zero, Vector.Copy(scale)];
            scaleAnimation.component = Components.TRANSFORM;
            scaleAnimation.property = "scale";
            scaleAnimation.type = AnimationSequenceTypes.VECTOR
            scaleAnimation.easing = "Linear";
            animation.sequences.push(scaleAnimation);
            Entity.AddComponent(entity, animation);

            this.entityManager.add(entity);
        }

        // Emitter 
        var emitterEntity = new Entity();
        var emitterPosition = new Vector(Random.Float(-100, 100), Random.Float(-100, 100));
        Entity.AddComponent(emitterEntity, new TransformComponent(emitterPosition));
        var emitterComponent = new ParticleEmitterComponent();
        emitterComponent.particleVelocity = new Vector(0.05, 0.05);
        emitterComponent.velocityRandomness = 1.5;
        emitterComponent.spread = Math.PI * 2;
        emitterComponent.size = 1;
        emitterComponent.color = new Color(100, 100, 90, 1);
        emitterComponent.colorEnd = new Color(100, 100, 0, 0);
        emitterComponent.particleSize = 2;
        emitterComponent.particleSizeRandomness = 2;
        emitterComponent.emissionRate = 0.05;
        emitterComponent.particleLifespan = 3000;
        emitterComponent.particleLifespanRandomness = 1.5;
        emitterComponent.foreground = true;
        Entity.AddComponent(emitterEntity, emitterComponent);
        var emitterVelocity = new Vector(Random.Float(-0.1, 0.1), Random.Float(-0.1, 0.1));
        var emitterMaxVelocity = Random.Float(0.05, 0.5);
        var emitterAcceleration = new Vector(Random.Float(-0.0001, 0.0001), Random.Float(-0.0001, 0.0001));
        Entity.AddComponent(emitterEntity, new MotionComponent(emitterVelocity, emitterMaxVelocity, emitterAcceleration));
        Entity.AddComponent(emitterEntity, new SelectableComponent());
        this.entityManager.add(emitterEntity);

        var fieldEntity = new Entity();
        Entity.AddComponent(fieldEntity, new TransformComponent(new Vector(emitterPosition.x, emitterPosition.y - 100)));
        var fieldComponent = new ForceFieldComponent();
        fieldComponent.mass = 3;
        fieldComponent.destructive = true;
        fieldComponent.radius = 50;
        fieldComponent.enabled = true;
        Entity.AddComponent(fieldEntity, fieldComponent);
        Entity.AddComponent(fieldEntity, new MotionComponent(Vector.Copy(emitterVelocity), emitterMaxVelocity, Vector.Copy(emitterAcceleration)));
        Entity.AddComponent(fieldEntity, new SelectableComponent());
        this.entityManager.add(fieldEntity);

        emitterComponent.fieldIds.push(fieldEntity.id);
    }

}

var scene = new ArkanoidScene();
scene.init();
scene.toggleLoop();